'use client'
import { useEffect, useState } from "react";
import { Badge } from "@/components/tailgrids/core/badge";
import { getCredential } from "@/utils/login";
import type { Credential } from "@/data/credentials";

// สีของ role แต่ละแบบ
const roleStyle: Record<string, string> = {
  user: "bg-red-50 text-red-600",
  manager: "bg-blue-50 text-blue-700",
  admin: "bg-purple-50 text-purple-700",
};

export default function User() {
  const [credential, setCredential] = useState<Credential | null>(null);

  // วิ่งไปอ่าน credential จาก localStorage
  useEffect(() => {
    setCredential(getCredential());
  }, []);

  if (credential === null) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg">
      {/* role */}
      <div className="flex items-center gap-1">
        <span className="font-bold">ROLE:</span>
        <Badge
          size="lg"
          className={`rounded-full text-base font-bold ${roleStyle[credential.role] ?? "bg-gray-100 text-gray-700"}`}
        >
          {credential.role.toUpperCase()}
        </Badge>
      </div>

      {/* name */}
      <div className="flex items-center gap-1">
        <span className="font-bold">NAME:</span>
        <Badge
          size="lg"
          className="rounded-full bg-green-50 text-base font-bold text-green-700"
        >
          {credential.name}
        </Badge>
      </div>

      {/* email */}
      <div className="flex items-center gap-1">
        <span className="font-bold">EMAIL:</span>
        <Badge
          size="lg"
          className="rounded-full bg-gray-100 text-base text-gray-700"
        >
          {credential.email}
        </Badge>
      </div>
    </div>
  );
}
