"use client";

import ActionTooltip from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { EventDocument } from "@/models/BashModels";
import { CalendarPlus } from "lucide-react";
import EventFlow from "./event-flow";
import { MemberRole } from "@/helpers/types";

interface EventComponentProps {
  itinerary: any;
  events: EventDocument[] | [];
  role: MemberRole;
}
const EventComponent = ({ events, itinerary, role }: EventComponentProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-4 font-semibold text-md text-black dark:text-white">
        {itinerary.name}
      </p>
      <div className="flex items-center justify-center flex-grow flex-col">
        {role !== MemberRole.GUEST && (
          <ActionTooltip side="bottom" align="center" label="Add Event">
            <button
              onClick={() => onOpen("createEvent", { itinerary: itinerary })}
              className="group flex items-center"
            >
              <div className="mx-3 my-3 h-[24px] w-[24px] rounded-[12x] group-hover:rounded-[8px] transition-all overflow-hidden bg-transparent dark:bg-[#2B2D31]">
                <CalendarPlus />
              </div>
            </button>
          </ActionTooltip>
        )}
        <div className="mt-4">
          {events.length === 0 ? (
            <div>
              No Events found in this itinerary.{" "}
              {role !== MemberRole.GUEST
                ? "Click the calendar button above to get started."
                : "Ask mods to create an event."}
            </div>
          ) : (
            <EventFlow events={events} role={role} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventComponent;
