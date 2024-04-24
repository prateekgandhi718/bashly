"use client"

import ActionTooltip from "@/components/action-tooltip"
import { useModal } from "@/hooks/use-modal-store"
import { BashDocument } from "@/models/BashModels"
import { Plus } from "lucide-react"


interface CreateItineraryProps {
    bash: BashDocument
}


const CreateItineraryComponent = ({bash}: CreateItineraryProps) => {
const {onOpen} = useModal()
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add Itinerary">
        <button onClick={() => onOpen("createItinerary", { bash: bash})} className="group flex items-center">
          <div
            className="flex mx-3 my-3 h-[24px] w-[24px] rounded-[12x] group-hover:rounded-[8px] transition-all overflow-hidden items-center justify-center bg-background
            dark:bg-[#1F1F1F] group-hover:bg-blue-500"
          >
            <Plus className="group-hover:text-white transition text-blue-500" />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default CreateItineraryComponent