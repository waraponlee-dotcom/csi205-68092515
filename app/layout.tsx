'use client'

import Header from "@/components/header";
import "./globals.css";
import Footer from "@/components/footer";
import User from "@/components/user";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/tailgrids/core/button";
import { usePathname, useRouter } from "next/navigation";
import { fetchProduct, type Product } from "@/data/products";
import { createContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/tailgrids/core/badge";
import { checkLogin, doLogout, getCredential } from "@/utils/login";




// กำหนด Type ของ Context เพื่อแก้ Error TypeScript
interface GlobalContextType {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  carts: Product[];
  setCarts: Dispatch<SetStateAction<Product[]>>;
}

export const globalDataContext = createContext<any>(null);

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Product[]>([]);

  // ยังไม่ผ่านการตรวจ login = false (ไม่แสดงเนื้อหาหน้าอื่น)
  const [authorized, setAuthorized] = useState<boolean>(false)
  const [role, setRole] = useState<string | null>(null)
  const isLoginPage = pathname === '/login'

  // ตอนนี้ทุก role เห็นทุกเมนูเหมือน admin (ไม่ล็อก)
  // ถ้าอยากกลับมาล็อกตาม role ให้เปลี่ยนเป็น:
  //   role === 'admin' || (role !== null && roles.includes(role))
  const canSee = (..._roles: string[]) => role !== null

  // ตรวจทุกครั้งที่เปลี่ยนหน้า: ไม่มี credential -> เด้งไป /login (และจำหน้าที่จะกลับมา)
  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true)
      setRole(null)
      return
    }
    const ok = checkLogin(router, pathname)
    setAuthorized(ok)
    setRole(ok ? getCredential()?.role ?? null : null)
  }, [pathname, router, isLoginPage])

  // โหลดสินค้า: ถ้าล้มเหลว (fetchProduct สุ่มล้ม 20%) ให้ลองใหม่อีกสูงสุด 3 ครั้ง
  // ใช้ console.warn แทน console.error เพื่อไม่ให้ Next dev overlay ขึ้น error สีแดง
  useEffect(() => {
    let cancelled = false
    const load = (retry: number) => {
      fetchProduct()
        .then((data) => {
          if (!cancelled) setProducts(data)
        })
        .catch((error) => {
          if (cancelled) return
          if (retry > 0) {
            load(retry - 1)
          } else {
            console.warn("Failed to fetch products:", error)
            setProducts([])
          }
        })
    }
    load(3)
    return () => { cancelled = true }
  }, [])


  useEffect(() => {
    console.log(products)
  }, [products])



  return (
    <globalDataContext.Provider
      value={{ products, setProducts, carts, setCarts }}>
      <html>
        <body>
          <Header />

          {/* ROLE / NAME / EMAIL (ซ่อนตอนอยู่หน้า login และตอนยังไม่ผ่านการตรวจ) */}
          {authorized && !isLoginPage && <User />}

          {/* ซ่อนเมนูตอนอยู่หน้า login และตอนยังไม่ผ่านการตรวจ */}
          {authorized && !isLoginPage && (
            <nav className="flex gap-4 mt-4 p-4 justify-center">
              {/* //Home */}
              {canSee('user', 'manager') && (
                <Link href={"/"}
                  className={buttonStyles({
                    appearance: pathname === "/" ? "fill" : "outline",
                    variant: "primary",
                    size: "sm"
                  })}
                >
                  Home
                </Link>
              )}

              {/* // Amination */}
              {canSee('user') && (
                <Link href="/animation"
                  className={buttonStyles({
                    appearance: pathname === "/animation" ? "fill" : "outline",
                    variant: "primary",
                    size: "sm"
                  })}
                >
                  Animation
                </Link>
              )}

              {/* // Calculate */}
              {canSee('user') && (
                <Link href="/calculator"
                  className={buttonStyles({
                    appearance: pathname === "/calculator" ? "fill" : "outline",
                    variant: "primary",
                    size: "sm"
                  })}
                >
                  Calculator
                </Link>
              )}

              {/* todo */}
              {canSee('manager') && (
                <Link href="/todos"
                  className={buttonStyles({
                    appearance: pathname === "/todos" ? "fill" : "outline",
                    variant: "primary",
                    size: "sm"
                  })}
                >
                  Todos
                </Link>
              )}

              {/* product */}
              {canSee('manager') && (
                <Link href="/products"
                  className={buttonStyles({
                    appearance: pathname === "/products" ? "fill" : "outline",
                    variant: "primary",
                    size: "sm"
                  })}
                >
                  Products({products.length})
                </Link>
              )}

              {/* carts */}
              {canSee('manager') && (
                <div className="relative">
                  <Link href="/carts"
                    className={buttonStyles({
                      appearance: pathname === "/carts" ? "fill" : "outline",
                      variant: "primary",
                      size: "sm"
                    })}
                  >
                    Carts
                  </Link>
                  <Badge size={'sm'} className="absolute -top-2 -right-2 bg-red-500 text-white "
                  >
                    {carts.length}
                  </Badge>
                </div>
              )}

              <Button
                size='sm'
                appearance='outline'
                variant='danger'
                className="ml-1"
                onClick={() => doLogout(router, '/login')}
              >Logout</Button>

            </nav>
          )}

          {/* หน้า login แสดงเสมอ, หน้าอื่นแสดงเมื่อผ่านการตรวจแล้วเท่านั้น */}
          <main style={{ display: authorized ? undefined : 'none' }}>{children}</main>
          <Footer />
        </body>
      </html>
    </globalDataContext.Provider>
  );
}