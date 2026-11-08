'use client'

import { Badge } from "@/components/tailgrids/core/badge";
import { Discord, Facebook, Google, Telephone1, Twitter } from "@tailgrids/icons";
import Link from "next/link";
export default function Footer() {
    return (
        // footer content
        <div className='text-center mt-4'>
            {/* stunden info */}
            <div>
                <Badge className="text-xl rounded-lg bg-blue-300 text-black">68092515 นายวรพล ลีลาทนาพร</Badge>
            </div>
            {/* contact info */}
            <div className='flex justify-center gap-6 mt-4'>
                <Link href="https://www.facebook.com" target="_blank">
                    <Facebook className='text-blue-700' />
                </Link>
                <div className='border-l'></div>
                <Link href="https://www.twitter.com">
                    <Twitter className='' />
                </Link>
                <div className='border-l'></div>
                <Link href="https://www.discord.com" target="_blank">
                    <Discord className='text-blue-700' />
                </Link>
                <div className='border-l'></div>
                <Link href="https://www.google.com" target="_blank">
                    <Google className='' />
                </Link>
            </div>
        </div>
    )
}