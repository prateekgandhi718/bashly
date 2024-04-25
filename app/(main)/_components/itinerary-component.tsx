// This will be another server component which will fetch all the events for a particular itinerary and then pass the events inside of a client component as props.

import dbConnect from "@/lib/dbConnect";
import { Event, EventDocument, ItineraryDocument } from "@/models/BashModels";
import EventComponent from "./event-component";

interface ItineraryComponentProps {
    bashId: string;
    itinerary: any
}

const ItineraryComponent = async ({bashId, itinerary}: ItineraryComponentProps) => {
  await dbConnect();

  // Find all the events present in this itinerary.
  const events = await Event.find({itinerary: itinerary._id}).sort({ startDateTime: 1 }).lean() as any[]

  const plainEvents = events.map((ev) => ({
    ...ev,
    _id: ev._id.toString(),
    itinerary: ev.itinerary.toString()
  }))

  return (
    <EventComponent itinerary={itinerary} events={plainEvents} />
  )
}

export default ItineraryComponent