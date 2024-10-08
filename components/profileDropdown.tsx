"use client"
import React from "react";
import { Cloud, Github, LifeBuoy, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { getInitials } from "@/helpers/getInitialsFunc";

const DropdownMenuDemo = () => {
  const { data } = useSession();
  const handleLogout = () => {
    try {
      signOut()
    } catch (e) {
      console.log(e)
    }
  }
  return (
    data?.user && data.user.image &&
    data.user.name && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="w-8 h-8 rounded-full mx-3">
            <Avatar>
              <AvatarImage src={data.user.image} />
              <AvatarFallback>{getInitials(data.user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{data.user.name}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <Link href="https://github.com/prateekgandhi718" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <Github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </DropdownMenuItem>
          </Link>
          <Link href="https://github.com/prateekgandhi718" target="_blank">
            <DropdownMenuItem className="cursor-pointer">
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem disabled>
            <Cloud className="mr-2 h-4 w-4" />
            <span>API</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default DropdownMenuDemo;
