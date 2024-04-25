"use client";

import ActionTooltip from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { EventDocument } from "@/models/BashModels";
import { CalendarPlus } from "lucide-react";
import EventFlow from "./event-flow";

interface EventComponentProps {
  itinerary: any
  events: EventDocument[] | [];
}
const EventComponent = ({
  events,
  itinerary
}: EventComponentProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-4 font-semibold text-md text-black dark:text-white">
        {itinerary.name}
      </p>
      <div className="flex items-center justify-center flex-grow flex-col">
        <ActionTooltip side="bottom" align="center" label="Add Event">
          <button
            onClick={() => onOpen("createEvent", {itinerary: itinerary})}
            className="group flex items-center"
          >
            <div className="mx-3 my-3 h-[24px] w-[24px] rounded-[12x] group-hover:rounded-[8px] transition-all overflow-hidden bg-transparent dark:bg-[#2B2D31]">
              <CalendarPlus />
            </div>
          </button>
        </ActionTooltip>
        <div className="mt-4">
          {events.length === 0 ? (
            <div>
              No Events found in this itinerary. Click the calendar button above
              to get started.
            </div>
          ) : (
            <EventFlow events={events} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventComponent;
