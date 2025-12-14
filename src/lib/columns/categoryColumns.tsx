"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon, TextSearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface CategoryModel {
  id: number;
  name: string;
}

export function columns(
  onDeleteClick: (id: number) => void
): ColumnDef<CategoryModel>[] {
  return [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: () => <div className="w-40">Title </div>,
      cell: ({ row }) => {
        const name = row.original.name || "-";
        const displayed =
          name.length > 25 ? `${name.substring(0, 25)}...` : name;

        return (
          <div>
            <Link
              href={`/taking/${row.original.id}`}
              className="hover:underline"
            >
              {displayed}
            </Link>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <div className="flex items-center space-x-2">
              <Link href={`/taking/${item.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-300"
                  title="Detail"
                >
                  <TextSearchIcon className="text-yellow-300" />
                </Button>
              </Link>
              <span className="mx-2">|</span>
              <Link href={`/admin/taking/edit/${item.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300"
                  title="Edit"
                >
                  <PencilIcon className="text-blue-300" />
                </Button>
              </Link>
              <span className="mx-2">|</span>
              <Button
                size="sm"
                title="Delete"
                variant="outline"
                className="border-red-300"
                onClick={() => onDeleteClick(item.id)}
              >
                <Trash2Icon className="text-red-300" />
              </Button>
            </div>
          </div>
        );
      },
    },
  ];
}
