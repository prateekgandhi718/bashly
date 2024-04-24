// This will be a server component which will fetch all the events for a particular itinerary and then pass the events inside of a client component as props.

import dbConnect from "@/lib/dbConnect";
import { Event, EventDocument } from "@/models/BashModels";
import EventComponent from "./event-component";

interface ItineraryComponentProps {
    bashId: string;
    itineraryId: string
}

const ItineraryComponent = async ({bashId, itineraryId}: ItineraryComponentProps) => {
  await dbConnect();

  // Find all the events present in this itinerary.
  const events = await Event.find({itinerary: itineraryId}).lean() as any[]

  const plainEvents = events.map((ev) => ({
    ...ev,
    itinerary: ev.itinerary.toString()
  }))

  return (
    <EventComponent events={plainEvents} />
  )
}

export default ItineraryComponent