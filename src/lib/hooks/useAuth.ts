import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export function useAuth(allowedRoles: string[] = []) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return; // tunggu router siap

    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Unauthorized");

        const user = await res.json();

        // cek role
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          const redirectUrl =
            router.asPath && !router.asPath.includes("[") ? router.asPath : "/";
          router.replace(`/?redirect=${encodeURIComponent(redirectUrl)}`);
          return;
        }

        setUser(user);
      } catch (err) {
        const redirectUrl =
          router.asPath && !router.asPath.includes("[") ? router.asPath : "/";
        router.replace(`/?redirect=${encodeURIComponent(redirectUrl)}`);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router.isReady]);

  return { user, loading };
}
