import { Button } from "@/components/ui/button";
import { formatDate } from "@/helpers/formatDateFunc";
import { useModal } from "@/hooks/use-modal-store";
import { EventDocument } from "@/models/BashModels";
import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface EventFlowProps {
  events: EventDocument[] | [];
}
const EventFlow = ({ events }: EventFlowProps) => {
  const { onOpen } = useModal();

  const [progressValues, setProgressValues] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const progressValuesForEvents = events.map((event) => {
        const startTime = event.startDateTime;
        const endTime = event.endDateTime;
        const totalDuration = differenceInSeconds(endTime, startTime);
        const elapsedTime = differenceInSeconds(now, startTime);

        if (elapsedTime <= 0) {
          return 0;
        } else if (elapsedTime >= totalDuration) {
          return 100;
        } else {
          return (elapsedTime / totalDuration) * 100;
        }
      });
      setProgressValues(progressValuesForEvents);
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  const getProgressColor = (index: number): string => {
    const progress = progressValues[index] ?? 0;
    if (progress === 100) {
      return "#99ff99"; // Completed (Green)
    } else if (progress > 0) {
      return "#FFC107"; // In Progress (Yellow)
    } else {
      return "blue"; // Not Started Yet (Blue)
    }
  };

  return (
    <div>
      {/* Events (Circular Progress Bars) */}
      <div className="flex flex-col items-center">
        {events.map((event, index) => (
          <div key={index} className="flex flex-row justify-center items-center">
            {/* vertical line! */}
            {index !== 0 && <div className="h-5 mb-20 absolute bg-gray-300 w-1"></div>}
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {formatDate(event.startDateTime)}
            </div>
            <button style={{ width: 60, height: 60, margin: 10 }} onClick={() => onOpen("editEvent", {event: event})}>
              <CircularProgressbarWithChildren value={progressValues[index] ?? 0} styles={{ path: { stroke: getProgressColor(index) }}}>
                {event.logo}
                <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                  {event.name && event.name.length > 6 ? event.name.slice(0, 4) + "..." : event.name}
                </p>
              </CircularProgressbarWithChildren>
            </button>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {formatDate(event.endDateTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventFlow;
