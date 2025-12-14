"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import React from "react";
import { Menu, UserIcon } from "lucide-react"; // Optional: ikon menu
import { useRouter } from "next/router";

interface DropdownNavbarUser {
  userName: string;
}

const NavbarUser: React.FC<DropdownNavbarUser> = ({ userName }) => {
  const router = useRouter();
  const logoutHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/auth/logout");
    window.location.href = "/";
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b-2 shadow-lg py-2 px-5 flex justify-between items-center">
      {/* Logo */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/bookmarker_icon.png"
              alt="library_icon.png"
              width={75}
              height={40}
            />
          </div>
        </Link>
        <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-center sm:text-left">
          Bookmarker App
        </h1>
      </div>

      {/* Menu kanan */}
      <div className="flex items-center space-x-2">
        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => router.push("/category-management")}
            >
              Category Management
            </DropdownMenuItem>
            <DropdownMenuItem>Creator Management</DropdownMenuItem>
            <DropdownMenuItem>Item Management</DropdownMenuItem>
            <DropdownMenuItem>Source Management</DropdownMenuItem>
            <DropdownMenuItem>Type Management</DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex justify-center">
              <Button variant="destructive" onClick={logoutHandler}>
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavbarUser;
