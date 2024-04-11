import { Hash } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import MobileToggle from "../mobile-toggle";
import SocketIndicator from "../socket-indicator";
import { Badge } from "../ui/badge";

interface ChatHeaderProps {
  bashId: string;
  name: string;
  type: "channel" | "conversation" | "bash";
  imageUrl?: string;
  startDate?: Date;
  endDate?: Date;
}

const ChatHeader = ({
  bashId,
  name,
  type,
  imageUrl,
  startDate,
  endDate,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle bashId={bashId} />
      {type === "bash" && (
        <>
          <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
        </>
      )}
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      {type === "bash" && (
        <Badge className="ml-auto flex items-center" variant="secondary">{`${startDate?.toDateString()} - ${endDate?.toDateString()}`}</Badge>
      )}
      {type !== "bash" && (
        <div className="ml-auto flex items-center">
          <SocketIndicator />
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
