import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/helpers/types";
import dbConnect from "@/lib/dbConnect";
import { Bash, Channel, Member, Message } from "@/models/BashModels";
import { currentProfilePages } from "@/lib/current-profile-pages-router";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req, res);
    const { content, fileUrl } = req.body;
    const { bashId, channelId } = req.query;
    
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }    
  
    if (!bashId) {
      return res.status(400).json({ error: "bash ID missing" });
    }
      
    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }
          
    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    await dbConnect()
    // Check if the memeber trying to send the message is part of this bash or not
    const member = await Member.findOne({
        bash: bashId,
        profile: profile._id,
    })

    if (!member) {
        return res.status(400).json({ message: "Member not a part of the bash!" });
    }

    const bash = await Bash.findById(bashId)

    if (!bash) {
      return res.status(404).json({ message: "bash not found" });
    }

    const channel = await Channel.findOne({
        _id: channelId,
        bash: bashId,
    })

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Create the message
    const newMessage = await Message.create({
        content,
        fileUrl,
        channelId,
        memberId: member._id,
    })

    // Find the message created
    const savedMessage = await Message.findById(newMessage._id).populate({
        path: 'memberId',
        populate: {
            path: 'profile',
        }
    }).exec()

    const channelKey = `chat:${channelId}:messages`; // We are gonna watch for the event having this key

    res?.socket?.server?.io?.emit(channelKey, savedMessage); // Emit a socket io to all the active connections!

    return res.status(200).json(savedMessage);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" }); 
  }
}