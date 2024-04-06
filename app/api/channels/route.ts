import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Channel, Member } from "@/models/BashModels";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json(); // Because we have values.name and values.type present in values.
    const { searchParams } = new URL(req.url);

    const bashId = searchParams.get("bashId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bashId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
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

    // Create the channel
    const newChannel = await Channel.create({
      name,
      type,
      profile: profile._id,
      bash: bashId,
    });

    return new NextResponse("Channel Created", { status: 200 }); // Depending upon how we rended channels we will create a seperate zustand state for channels and update it.
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
