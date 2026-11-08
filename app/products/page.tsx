'use client'
import { useContext, useEffect } from "react"
import { globalDataContext } from "../layout"
import { Product } from "@/data/products"
import Image from "next/image"
import { buttonStyles } from "@/components/tailgrids/core/button"
import { checkLogin } from "@/utils/login"
import { useRouter } from "next/navigation"

export default function Page() {
      const router = useRouter()
      useEffect(() => { checkLogin(router, '/products') }, [router])

    const { products, setProducts, setCarts } = useContext(globalDataContext)
    

    const addToCart = (product:Product) => { 
        setCarts((currentCarts: Product[]) => [...currentCarts, product])
        setProducts((currentProducts: Product[]) =>
            currentProducts.filter((item) => item.id !== product.id)
        )
    }

    return (
        <div className="mx-auto mt-4 h-[70vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-sky-300 bg-sky-50 p-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {products.map((product: Product) => (
                    <div key={product.id} className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
                        <div className="relative aspect-square">
                            <Image
                                src={product.thumbnailUrl}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 150px"
                                className="object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 line-clamp-2 bg-black/50 px-1.5 py-1 text-[10px] leading-tight text-white">
                                {product.title}
                            </div>
                            <div className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                ${product.price}
                            </div>
                        </div>
                        <button className={buttonStyles({
                            variant: "success",
                            appearance: "outline",
                            size: "xs",
                            className: "w-full rounded-none border-0 border-t border-green-500 bg-green-50 text-green-700 hover:bg-green-100",
                        })}
                        onClick={() => addToCart(product)}
                        >
                            
                            Add to Carts
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}