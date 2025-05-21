"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getGraphqlClient } from "@/lib/graphqlClient";
import { ME_QUERY } from "@/lib/queries";
import Link from "next/link";

interface Me {
  id: string;
  username: string;
  name: string;
  role: "admin" | "student";
  universityId: string;
}
export interface MeResponse {
  me: Me;
}

export function UserNav() {
  const router = useRouter();
  const { logout, role } = useAuth();
  const [user, setUser] = useState<Me>();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = (await getGraphqlClient().request(ME_QUERY)) as MeResponse;
        setUser(data.me);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 flex items-center gap-2 text-zinc-300"
        >
          <span>
            {`${role === "admin" ? "Admin" : "Student"} ${user?.name}`}
          </span>
          <Avatar className="h-8 w-8 p-1 bg-blue-700 flex justify-center items-center">
            <div>{user?.name.slice(0, 1).toUpperCase()}</div>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-zinc-900 border-zinc-800 text-zinc-300"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {`${role === "admin" ? "Admin" : "Student"} ${user?.name}`}
            </p>
            <p className="text-xs text-zinc-500">{user?.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800">
          <Link href="/profile" className="w-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          className="cursor-pointer text-red-500 hover:bg-zinc-800 hover:text-red-500"
          onClick={handleLogout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
