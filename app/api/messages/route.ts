import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { Message, MessageDocument } from "@/models/BashModels";
import dbConnect from "@/lib/dbConnect";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    await dbConnect();

    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    let messages = [];

    const findQuery: any = { channelId };

    if (cursor) {
      findQuery["_id"] = { $lt: cursor };
    }

    const skipCount = cursor ? 1 : 0;

    messages = await Message.find(findQuery)
      .populate({
        path: "memberId",
        populate: { path: "profile" },
      })
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(MESSAGES_BATCH);

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[messages.length - 1]._id;
    }
    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


// This messages API inside the App router is only GET API. The messages API inside the pages router (index.ts) is the one to save the message to db and also emit the message to the socket listeners.