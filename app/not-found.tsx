'use client'

import { checkLogin } from "@/utils/login"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NotFound() {
    const router = useRouter()
    useEffect(() => { checkLogin(router, '/') }, [router])

    return (
        <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold">404</h1>
            <p className="mt-2 text-gray-500">Page not found</p>
        </div>
    )
}