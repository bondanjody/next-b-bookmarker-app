"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import NavbarAdmin from "@/components/NavbarAdmin";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import { NotepadText, PlusIcon, HistoryIcon } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import NavbarSuperAdmin from "@/components/NavbarSuperadmin";
import NavbarUser from "@/components/NavbarUser";
import { columns } from "@/lib/columns/categoryColumns";
import { DataTable } from "@/components/ui/data-table";

interface CategoryModel {
  id: number;
  name: string;
}

export default function CategoryManagementDashboard() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Bookmarker App";
  const { user, loading } = useAuth([
    "B.BM.ADMIN",
    "B.BM.SUPERADMIN",
    "B.BM.USER",
  ]);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [categoryData, setCategoryData] = useState<CategoryModel[]>([]);
  const router = useRouter();
  const [deleteTakingId, setDeleteTakingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getDataCategory = async () => {
    try {
      const res = await axios.get(
        "/api/category-management/get-all-category-by-user"
      );

      const categories = res.data?.data ?? [];

      const mappedData = categories.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));

      setCategoryData(mappedData);
    } catch (error) {
      console.error(error);
      toast.warning("Can't get category data !");
      setCategoryData([]);
    }
  };

  const selectMenuAction = (value: string) => {
    setSelectedMenu(value);
  };

  const handleDelete = async () => {
    if (!deleteTakingId) return;

    const data = {
      taking_id: parseInt(deleteTakingId),
    };

    try {
      const res = await axios.post("/api/taking/deleteTakingEvent", data);

      const { status, message } = res.data;

      toast.warning(
        message || (status ? "Taking Data DELETED!" : "Deletion failed.")
      );

      if (status) {
        getDataCategory(); // Refresh data jika berhasil
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Taking Data Deletion FAILED!";

      toast.warning(errorMessage);
    } finally {
      setDeleteTakingId(null); // Reset setelah selesai
    }
  };

  useEffect(() => {
    if (loading || !user) return; // Jangan lanjut kalau masih loading

    getDataCategory();
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{appName} :: Category Management Dashboard</title>
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
                <CardTitle>Categories</CardTitle>
                <CardDescription>Browse all categories.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Link href="/category-management/add">
                    <Button variant="outline">
                      <PlusIcon className="mr-2" /> New Category
                    </Button>
                  </Link>
                </div>
                {categoryData.length > 0 && (
                  <DataTable
                    columns={columns((id) => setDeleteTakingId(id.toString()))}
                    data={categoryData}
                  />
                )}
                {categoryData.length === 0 && (
                  <div className="p-4 text-center">No category data found.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Alert Dialog Delete */}
      <AlertDialog
        open={!!deleteTakingId}
        onOpenChange={(open) => !open && setDeleteTakingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              This action can NOT be undone. Are you sure ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You wanna delete:{" "}
              {categoryData.find((u) => u.id === Number(deleteTakingId))
                ?.name ?? "(Unknown)"}
              <p className="text-red-500 p-2 bg-red-200 mt-4 rounded-md">
                WARNING : This action can NOT be undone !
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
