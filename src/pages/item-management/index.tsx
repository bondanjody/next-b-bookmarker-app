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
import { columns } from "@/lib/columns/itemColumns";
import { DataTable } from "@/components/ui/data-table";

interface RelationModel {
  id: string;
  name: string;
}

interface ItemModel {
  id: number;
  title: string;
  link: string;
  is_done: boolean;
  notes: string;
  category_data: RelationModel;
  source_data: RelationModel;
  type_data: RelationModel;
  creator_data: RelationModel;
}

export default function ItemManagementDashboard() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Bookmarker App";
  const { user, loading } = useAuth([
    "B.BM.ADMIN",
    "B.BM.SUPERADMIN",
    "B.BM.USER",
  ]);
  const [selectedMenu, setSelectedMenu] = useState<string>("");
  const [itemData, setItemData] = useState<ItemModel[]>([]);
  const router = useRouter();
  const [deleteTakingId, setDeleteTakingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getDataItem = async () => {
    try {
      const res = await axios.get("/api/item-management/get-all-item-by-user");

      const items = res.data?.data ?? [];

      const mappedData = items.map((item: any) => ({
        id: item.id,
        title: item.title,
        link: item.link,
        is_done: item.is_done,
        notes: item.notes,
        created_at: item.created_at,

        // 🔗 relasi (aman walaupun null)
        category_name: item.category_data?.name ?? "-",
        type_name: item.type_data?.name ?? "-",
        source_name: item.source_data?.name ?? "-",
        creator_name: item.creator_data?.name ?? "-",
      }));

      setItemData(mappedData);
    } catch (error) {
      console.error(error);
      toast.warning("Can't get item data !");
      setItemData([]);
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
        getDataItem(); // Refresh data jika berhasil
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

    getDataItem();
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
        <title>{appName} :: Item Management Dashboard</title>
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
                <CardTitle>Items</CardTitle>
                <CardDescription>Browse all items.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Link href="/item-management/add">
                    <Button variant="outline">
                      <PlusIcon className="mr-2" /> New Item
                    </Button>
                  </Link>
                </div>
                {itemData.length > 0 && (
                  <DataTable
                    columns={columns((id) => setDeleteTakingId(id.toString()))}
                    data={itemData}
                  />
                )}
                {itemData.length === 0 && (
                  <div className="p-4 text-center">No item data found.</div>
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
              {itemData.find((u) => u.id === Number(deleteTakingId))?.title ??
                "(Unknown)"}
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
