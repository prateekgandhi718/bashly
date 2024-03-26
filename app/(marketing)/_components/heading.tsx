"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export const Heading = () => {
  const { status } = useSession();
  const handleEnter = () => {
    try {
      signIn("google");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Make Every Event a Bash! Welcome to{" "}
        <span className="underline">Bashly</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Bashly is the ultimate event management tool for wedding planners, event
        coordinators, and anyone hosting a celebration.
      </h3>
      {status === "loading" && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {status !== "loading" && status === "unauthenticated" && (
        <Button onClick={handleEnter}>
          Get Bashly Free
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
      {status !== "loading" && status === "authenticated" && (
        <Button asChild>
          <Link href="/documents">
            Enter Bashly
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
};
