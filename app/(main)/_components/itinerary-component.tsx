// This will be another server component which will fetch all the events for a particular itinerary and then pass the events inside of a client component as props.

import dbConnect from "@/lib/dbConnect";
import { Event } from "@/models/BashModels";
import EventComponent from "./event-component";
import { MemberRole } from "@/helpers/types";

interface ItineraryComponentProps {
    bashId: string;
    itinerary: any;
    role: MemberRole;
}

const ItineraryComponent = async ({bashId, itinerary, role}: ItineraryComponentProps) => {
  await dbConnect();

  // Find all the events present in this itinerary.
  const events = await Event.find({itinerary: itinerary._id}).sort({ startDateTime: 1 }).lean() as any[]

  const plainEvents = events.map((ev) => ({
    ...ev,
    _id: ev._id.toString(),
    itinerary: ev.itinerary.toString()
  }))

  return (
    <EventComponent itinerary={itinerary} events={plainEvents} role={role} />
  )
}

export default ItineraryComponent