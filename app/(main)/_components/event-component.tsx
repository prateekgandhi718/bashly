"use client"

import { EventDocument } from "@/models/BashModels"

interface EventComponentProps {
    events: EventDocument[] | []
}
const EventComponent = ({events}: EventComponentProps) => {
  return (
    <div>EventComponent</div>
  )
}

export default EventComponent