"use client";
// This is a client component fetching data via tanstack react query. We could have fetched using a server component as well but we want to fetch messages in a controlled way so used infinite query. and also we have sockets in here so gotta use hooks.

import { Fragment, useRef, ElementRef } from "react";
import { format } from "date-fns";
import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hooks/use-chat-query";

import {
  MemberDocument,
  MessageDocument,
  ProfileDocument,
} from "@/models/BashModels";
import ChatWelcome from "./chat-welcome";
import ChatItem from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { loadingMessagesArray, pickRandomLoadingString } from "@/helpers/loadingMessagesArray";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMemberWithProfile = MessageDocument & {
  member: MemberDocument & {
    profile: ProfileDocument;
  };
};

interface ChatMessagesProps {
  name: string;
  member: MemberDocument;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`; //This should be the same as the addKey defined in the socket api.
  const updateKey = `chat:${chatId}:messages:update`; // This should be the same as the addKey defined in the socket api.

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
    useChatSocket({ queryKey, addKey, updateKey }); //This is a hook which return nothing. It just has a useEffect hook inside it. The only thing we can use to update chat messages component is use useEffect hook here only. Or use a hook. Cant make it a component right?

    useChatScroll({
      chatRef,
      bottomRef,
      loadMore: fetchNextPage,
      shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
      count: data?.pages?.[0]?.items?.length ?? 0,
    })

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {pickRandomLoadingString(loadingMessagesArray)}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      {/* the flex reverse below is v important to diplay in reverse order */}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message._id}
                id={message._id}
                currentMember={member}
                member={
                  message.memberId as MemberDocument & {
                    profile: ProfileDocument;
                  }
                }
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
