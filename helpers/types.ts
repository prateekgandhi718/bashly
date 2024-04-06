import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export enum ChannelType {
  SYSTEM = "SYSTEM",
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export enum MemberRole {
  GUEST = "GUEST",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
