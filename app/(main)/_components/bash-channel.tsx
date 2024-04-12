"use client"

import ActionTooltip from "@/components/action-tooltip";
import { ChannelType, MemberRole } from "@/helpers/types"
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { BashDocument, ChannelDocument } from "@/models/BashModels"
import { Edit, Hash, Lock, Monitor, ShieldCheck, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface BashChannelProps {
    channel: ChannelDocument
    bash: BashDocument
    role?: MemberRole
}

const iconMap = {
    [ChannelType.SYSTEM]: Monitor,
    [ChannelType.OPEN]: Hash,
    [ChannelType.MODS]: ShieldCheck,
  }

const BashChannel = ({channel, bash, role}: BashChannelProps) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();
  
    const Icon = iconMap[channel.type as ChannelType];
  
    const handleClick = () => {
      router.push(`/bashes/${params?.bashId}/channels/${channel._id}`)
    }
  
    const onAction = (e: React.MouseEvent, action: ModalType) => {
      e.stopPropagation();
      onOpen(action, { bash:bash, channel: channel });
    }
  
    return (
      <button
        onClick={handleClick}
        className={cn(
          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
          params?.channelId === channel._id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
      >
        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <p className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel._id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}>
          {channel.name}
        </p>
        {channel.name !== "general" && channel.type !== ChannelType.SYSTEM && role !== MemberRole.GUEST && (
          <div className="ml-auto flex items-center gap-x-2">
            <ActionTooltip label="Edit">
              <Edit
                onClick={(e) => onAction(e, "editChannel")}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              <Trash
                onClick={(e) => onAction(e, "deleteChannel")}
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === "general" && (
          <Lock
            className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400"
          />
        )}
      </button>
    )
  }

export default BashChannel