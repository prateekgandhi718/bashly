import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/helpers/types";
import dbConnect from "@/lib/dbConnect";
import { Bash, Channel, Conversation, DirectMessage, Member, Message } from "@/models/BashModels";
import { currentProfilePages } from "@/lib/current-profile-pages-router";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req, res); //a different way to access the session using the pages router.
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;
    
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }    
      
    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }
          
    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    await dbConnect()
    
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
    // Create the message
    const newMessage = await DirectMessage.create({
        content,
        fileUrl,
        conversationId,
        memberId: member._id,
    })

    // Find the message created
    const savedMessage = await DirectMessage.findById(newMessage._id).populate({
        path: 'memberId',
        populate: {
            path: 'profile',
        }
    }).exec()

    const channelKey = `chat:${conversationId}:messages`; // We are gonna watch for the event having this key

    res?.socket?.server?.io?.emit(channelKey, savedMessage); // Emit a socket io to all the active connections!

    return res.status(200).json(savedMessage);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" }); 
  }
}