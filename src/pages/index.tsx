"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Login = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Bookmarker App";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Cek jika user sudah login
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (!user) return;
        else if (user.role === "B.BM.ADMIN" || user.role === "B.BM.SUPERADMIN")
          router.push("/admin/dashboard");
        else if (user.role === "B.BM.USER") router.push("/dashboard");
        else router.push("/");
      });
  }, []);

  useEffect(() => {
    if (name === "") {
      // Fokuskan input hanya saat barcode kosong (setelah reset)
      usernameInputRef.current?.focus();
    }
  }, [name]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validasi input
    if (name.trim().length === 0) {
      toast.warning("Username can NOT be empty !");
      setLoading(false);
      return;
    }

    if (password.trim().length === 0) {
      toast.warning("Password can NOT be empty !");
      setLoading(false);
      return;
    }

    try {
      // Proses login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.warning(`${data.message ? data.message : "Login FAILED !"}`);
        return;
      }

      // Ambil data user setelah login
      const userRes = await fetch("/api/auth/me");
      const user = await userRes.json();

      // Ambil redirect dari query
      const redirectTo = (router.query.redirect as string) || null;

      // Jika ada redirect di URL, arahkan ke sana
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      // Jika tidak, arahkan berdasarkan role
      if (user.role === "SUPERADMIN" || user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "USER") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      toast.warning("There is an error in login !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{appName} :: Login</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          {/* <h2 className="text-2xl font-bold mb-4 text-center">Login</h2> */}
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="flex items-center">
              <Image
                src="/bookmarker_icon.png"
                alt="server_room_logo"
                width={150}
                height={75}
              />
            </div>
            <div className="mt-4 font-bold text-center text-xl">
              <p>{appName}</p>
            </div>
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus={true}
                ref={usernameInputRef}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
