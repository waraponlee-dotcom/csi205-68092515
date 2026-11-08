'use client'

import Image from "next/image"
import { useContext, useEffect } from "react"
import { buttonStyles } from "@/components/tailgrids/core/button"
import type { Product } from "@/data/products"
import { globalDataContext } from "../layout"
import { useRouter } from "next/navigation"
import { checkLogin } from "@/utils/login"

export default function Page() {
      const router = useRouter()
      useEffect(() => { checkLogin(router, '/carts') }, [router])

    const { carts, setCarts, setProducts } = useContext(globalDataContext)
    const totalPrice = carts.reduce((total: number, product: Product) => total + product.price, 0)

    const removeFromCart = (product: Product) => {
        setCarts((currentCarts: Product[]) =>
            currentCarts.filter((item) => item.id !== product.id)
        )
        setProducts((currentProducts: Product[]) =>
            currentProducts.some((item) => item.id === product.id)
                ? currentProducts
                : [...currentProducts, product]
        )
    }

    return (
        <section className="mx-auto mt-4 w-full max-w-3xl px-3">
            <div className="h-[70vh] overflow-y-auto rounded-xl border border-sky-300 bg-sky-50 p-3">
                {carts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {carts.map((product: Product) => (
                            <article
                                key={product.id}
                                className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm"
                            >
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
                                        ${product.price.toFixed(2)}
                                    </div>
                                </div>
                                <button
                                    className={buttonStyles({
                                        variant: "danger",
                                        appearance: "outline",
                                        size: "xs",
                                        className: "w-full rounded-none border-0 border-t border-red-500 bg-red-50 text-red-600 hover:bg-red-100",
                                    })}
                                    onClick={() => removeFromCart(product)}
                                >
                                    Remove
                                </button>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="py-12 text-center text-sm text-gray-500">Your cart is empty.</p>
                )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 py-3">
                <span className="rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-amber-950">
                    Count: {carts.length} items
                </span>
                <span className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white">
                    Price: ${totalPrice.toFixed(2)}
                </span>
            </div>
        </section>
    )
}
