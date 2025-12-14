"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavbarSuperAdmin from "@/components/NavbarSuperadmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import NavbarUser from "@/components/NavbarUser";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NewCategory = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Bookmarker App";
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: pageLoading } = useAuth([
    "B.BM.ADMIN",
    "B.BM.SUPERADMIN",
    "B.BM.USER",
  ]);

  useEffect(() => {
    if (pageLoading || !user) return; // Jangan lanjut kalau masih loading
  }, [pageLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Perform login logic here, e.g., call your API

    // Validasi input
    if (categoryName.trim().length === 0) {
      toast.warning("Name can NOT be empty !");
      setLoading(false);
      return;
    }

    const data = {
      name: categoryName,
    };

    const addNewCategory = await axios
      .post("/api/category-management/add-new-category", data)
      .then((res) => {
        return {
          status: res.data.status ?? true,
          message: res.data.message ?? "Data saved !",
        };
      })
      .catch((err) => {
        return {
          status: err.response?.data?.status ?? false,
          message: err.response?.data?.message ?? "Error in saving data !",
        };
      });

    if (addNewCategory.status) {
      toast.info(addNewCategory.message);
      router.back();
    } else {
      toast.warning(addNewCategory.message);
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{appName} :: New Category</title>
      </Head>
      {user?.role === "B.BM.USER" && <NavbarUser userName={user?.username} />}
      {user?.role === "B.BM.ADMIN" && <NavbarAdmin userName={user?.username} />}
      {user?.role === "B.BM.SUPERADMIN" && (
        <NavbarSuperAdmin userName={user?.username} />
      )}
      <div className="flex">
        <div className="p-5 w-full md:max-w-full">
          <div>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>New Category</CardTitle>
                <CardDescription>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="username" className="block text-gray-700">
                        Name
                      </label>
                      <Input
                        type="text"
                        id="username"
                        value={categoryName}
                        disabled={loading}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <Button type="submit" disabled={loading}>
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => router.back()}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCategory;
