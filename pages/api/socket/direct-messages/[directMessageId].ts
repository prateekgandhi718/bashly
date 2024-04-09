import { NextApiRequest } from "next";
import { Bash, Channel, Conversation, DirectMessage, Member, Message } from "@/models/BashModels";
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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Convo ID missing" });
    }

    await dbConnect();

    const conversation = await Conversation.findById(conversationId).populate({
        path: 'memberOneId memberTwoId',
        populate: {
            path: 'profile',
        },
    })

    if (!conversation) {
        return res.status(404).json({message: "Convo not found"})
    }

    // Check if we are member one or two
    const memberId = conversation.memberOneId.profile._id.toString() === profile._id.toString() ? conversation.memberOneId._id : conversation.memberTwoId._id
    // Fetch this member
    const member = await Member.findById(memberId).lean() as any

    let directMessage = await DirectMessage.findOne({
      _id: directMessageId,
      conversationId: conversation._id,
    }).populate({
      path: "memberId",
      populate: { path: "profile" },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = directMessage.memberId._id.toString() === member._id.toString();
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const now = new Date()
    if (req.method === "DELETE") {
      directMessage = await DirectMessage.findByIdAndUpdate(
        directMessage._id,
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

      directMessage = await DirectMessage.findByIdAndUpdate(
        directMessage._id,
        { content, updatedAt: now },
        { new: true }
      ).populate({
        path: "memberId",
        populate: { path: "profile" },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`; //Watch for updating of a message event! (deleting or updating both)

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID_PAGES_ROUTER]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
