import { useRouter } from "next/navigation";
import { logout } from "@/data/credentials";
import type { Credential } from "@/data/credentials";

type Router = ReturnType<typeof useRouter>;

// อ่าน credential จาก localStorage
// คืนค่า null ถ้าไม่มี, JSON เสีย หรือข้อมูลไม่ครบ
export const getCredential = (): Credential | null => {
  if (typeof window === "undefined") return null;

  const credentialString = localStorage.getItem("credential");
  if (credentialString === null) return null;

  try {
    const { token, email, name, role } = JSON.parse(credentialString);
    if (
      token !== undefined &&
      email !== undefined &&
      name !== undefined &&
      role !== undefined
    ) {
      return { token, email, name, role };
    }
  } catch {
    // JSON เสีย ถือว่าไม่มี credential
  }
  return null;
};

export const checkLogin = (router: Router, returnPath: string): boolean => {
  const loggedIn = getCredential() !== null;

  if (!loggedIn) {
    localStorage.setItem("returnPath", returnPath);
    router.replace("/login");
    router.refresh();
  }
  return loggedIn;
};

export const doLogout = (router: Router, path: string = "/login"): Promise<void> => {
  // ดึง token จาก credential ที่เก็บไว้
  const token = getCredential()?.token ?? "";

  return logout(token)
    .then(() => undefined)
    .catch(() => undefined)
    .finally(() => {
      localStorage.removeItem("credential");
      router.replace(path);
      router.refresh();
    });
};