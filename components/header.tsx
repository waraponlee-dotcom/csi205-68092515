'use client'
import { Badge } from "@/components/tailgrids/core/badge";


export default function Header() {
    return (
        // header content
        <div className='m-4 text-center'>
            {/* code */}
            <div className = 'flex justify-center gap-4'>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-red-500 text-gray-100 rotate-8">C</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-green-700 text-gray-100 -rotate-5">S</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-blue-700 text-gray-100 rotate-7">I</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-sky-400 text-gray-100 -rotate-5">2</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-yellow-400 text-gray-100 rotate-4">0</Badge>
                <Badge className="text-3xl rounded-lg py-1 px-3 bg-gray-500 text-gray-100 -rotate-5">5</Badge>
            </div>
            {/* name */}
            <div className = 'mt-2'>
                <Badge size="lg" className="text-3xl rounded-lg py-1 px-3 bg-gray-800 text-gray-100">FRONT END SOFTWARE DEVELOPMENT</Badge>
            </div>
        </div>
    )
}