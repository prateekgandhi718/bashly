"use client";

import { Badge } from "@/components/ui/badge";
import { useSocket } from "./providers/socket-provider";
import { Cloud, CloudOff } from "lucide-react";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge 
        variant="outline" 
        className="bg-yellow-200 text-white border-none"
      >
        <CloudOff className="h-4 w-4 text-black"/>
      </Badge>
    )
  }

  return (
    <Badge 
      variant="outline" 
      className="bg-emerald-200 text-white border-none"
    >
      <Cloud className="h-4 w-4 text-black"/>
    </Badge>
  )
}

export default SocketIndicator