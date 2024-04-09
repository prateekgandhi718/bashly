import { NextApiRequest } from "next";
import { Bash, Channel, Member, Message } from "@/models/BashModels";
import { MemberRole, NextApiResponseServerIo } from "@/helpers/types";
import { currentProfilePages } from "@/lib/current-profile-pages-router";
import dbConnect from "@/lib/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req, res);
    const { messageId, bashId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!bashId) {
      return res.status(400).json({ error: "Bash ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    await dbConnect();
    const bash = await Bash.findById(bashId);

    if (!bash) {
      return res.status(404).json({ error: "Bash not found" });
    }

    const member = await Member.findOne({
      profile: profile._id,
      bash: bash._id,
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const channel = await Channel.findOne({
      _id: channelId,
      bash: bash._id,
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    let message = await Message.findOne({
      _id: messageId,
      channelId: channel._id,
    }).populate({
      path: "memberId",
      populate: { path: "profile" },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId._id.toString() === member._id.toString();
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const now = new Date()
    if (req.method === "DELETE") {
      message = await Message.findByIdAndUpdate(
        message._id,
        {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
          updatedAt: now,
        },
        { new: true }
      ).populate({
        path: "memberId",
        populate: { path: "profile" },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await Message.findByIdAndUpdate(
        message._id,
        { content, updatedAt: now },
        { new: true }
      ).populate({
        path: "memberId",
        populate: { path: "profile" },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`; //Watch for updating of a message event! (deleting or updating both)

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID_PAGES_ROUTER]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
