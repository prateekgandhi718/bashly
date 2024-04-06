"use client"

import ActionTooltip from "@/components/action-tooltip"
import { ChannelType, MemberRole } from "@/helpers/types"
import { useModal } from "@/hooks/use-modal-store"
import { BashDocument } from "@/models/BashModels"
import { Plus, Settings } from "lucide-react"

interface BashSectionProps {
    label: string
    role?: MemberRole
    sectionType: "channels" | "members"
    channelType?: ChannelType
    bash?: BashDocument
    members?: any
}

const BashSection = ({
    label, role, sectionType, channelType, bash, members
}:BashSectionProps) => {
    const { onOpen } = useModal();

    return (
      <div className="flex items-center justify-between py-2">
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        {role !== MemberRole.GUEST && sectionType === "channels" && (
          <ActionTooltip label="Create Channel" side="top">
            <button
              onClick={() => onOpen("createChannel", {channelTypeToBeCreated: channelType})}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
        {role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label="Manage Members" side="top">
            <button
              onClick={() => onOpen("members", { bash: bash, members: members })}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
              <Settings className="h-4 w-4" />
            </button>
          </ActionTooltip>
        )}
      </div>
    )
  }
export default BashSection