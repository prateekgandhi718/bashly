import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Event, Itinerary, Member } from "@/models/BashModels";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, startDateTime, endDateTime, logo, description } =
      await req.json();
    const { searchParams } = new URL(req.url);

    const bashId = searchParams.get("bashId");
    const itineraryId = searchParams.get("itineraryId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bashId) {
      return new NextResponse("Bash ID missing", { status: 400 });
    }

    if (!itineraryId) {
      return new NextResponse("Itinerary ID missing", { status: 400 });
    }

    await dbConnect();

    // Check if the user is a member of the bash and has the required role
    const member = await Member.findOne({
      bash: bashId,
      profile: profile._id,
    });
    if (!member || (member.role !== "ADMIN" && member.role !== "MODERATOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create the event
    const newEvent = await Event.create({
      itinerary: itineraryId,
      name,
      startDateTime,
      endDateTime,
      description,
      logo,
    });

    return new NextResponse("Event Created", { status: 200 });
  } catch (error) {
    console.log("EVENTS_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, startDateTime, endDateTime, logo, description } = await req.json();
    const { searchParams } = new URL(req.url);

    const bashId = searchParams.get("bashId");

    const eventId = searchParams.get("eventId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bashId) {
      return new NextResponse("Bash ID missing", { status: 400 });
    }

    if (!eventId) {
      return new NextResponse("Event ID missing", { status: 400 });
    }

    await dbConnect();

    // Check if the user is a member of the bash and has the required role
    const member = await Member.findOne({
      bash: bashId,
      profile: profile._id,
    });
    if (!member || (member.role !== "ADMIN" && member.role !== "MODERATOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    event.name = name;
    event.description = description;
    event.logo = logo;
    event.startDateTime = startDateTime;
    event.endDateTime = endDateTime;
    await event.save();

    return new NextResponse("Event edited successfully", { status: 200 });
  } catch (error) {
    console.log("[EVENTS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
