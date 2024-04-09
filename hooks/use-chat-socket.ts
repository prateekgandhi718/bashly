import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";
import { MemberDocument, MessageDocument, ProfileDocument } from "@/models/BashModels";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

type MessageWithMemberWithProfile = MessageDocument & {
  member: MemberDocument & {
    profile: ProfileDocument;
  }
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => { //query key is used to target our infinite query and modify its data. query key is set to `chat:${chatId}` and chatId is channelId
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item._id === message._id) { //this means we found the message to replace. message is coming from the socket. we are basically modifying the data of the query by checking which message does our socket emit.
                return message;
              }
              return item; //leave all others as it is
            })
          }
        });

        return {
          ...oldData,
          pages: newData,
        }
      })
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{
              items: [message],
            }]
          }
        }

        const newData = [...oldData.pages];

        newData[0] = { //newData[0] to edit only the first page since new message added will be there
          ...newData[0],
          items: [
            message,
            ...newData[0].items,
          ]
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    }
  }, [queryClient, addKey, queryKey, socket, updateKey]);
}