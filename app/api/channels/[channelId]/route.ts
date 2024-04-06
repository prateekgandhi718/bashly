import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@/helpers/types";
import dbConnect from "@/lib/dbConnect";
import { Channel, Member } from "@/models/BashModels";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const bashId = searchParams.get("bashId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bashId) {
      return new NextResponse("Bash ID missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    await dbConnect();

    // Check if the current user is ADMIN or MODERATOR
    const member = await Member.findOne({ profile: profile._id, bash: bashId });
    if (
      !member ||
      ![MemberRole.ADMIN, MemberRole.MODERATOR].includes(member.role)
    ) {
      return new NextResponse("Only ADMIN or MODERATOR can delete a channel", {
        status: 403,
      });
    }

    // Check if the channel is "general"
    const channel = await Channel.findById(params.channelId);
    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    if (channel.name === "general") {
      return new NextResponse("Cannot delete the general channel", {
        status: 400,
      });
    }

    // Delete the channel
    await Channel.findByIdAndDelete(params.channelId);

    return new NextResponse("Channel deleted successfully", { status: 200 });
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const bashId = searchParams.get("bashId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bashId) {
      return new NextResponse("Bash ID missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    await dbConnect();
    // Check if the current user is ADMIN or MODERATOR
    const member = await Member.findOne({ profile: profile._id, bash: bashId });
    if (
      !member ||
      ![MemberRole.ADMIN, MemberRole.MODERATOR].includes(member.role)
    ) {
      return new NextResponse("Only ADMIN or MODERATOR can edit a channel", {
        status: 403,
      });
    }

    const channel = await Channel.findById(params.channelId);
    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    channel.name = name;
    channel.type = type;
    await channel.save();

    return new NextResponse("Channel edited successfully", { status: 200 });
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
