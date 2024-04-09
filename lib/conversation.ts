import { Conversation } from "@/models/BashModels";
import dbConnect from "./dbConnect";

// we will call this function when a user clicks on any member. It will initiate a new conversation with them if it has not been initiated before.
export const getOrCreateConverastion = async(memberOneId:string, memberTwoId:string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId) // Switching the order as well to check if convo exists

    if (!conversation) {
        conversation = await newConversation(memberOneId, memberTwoId)
    }

    return conversation
}

const findConversation = async (memberOneId:string, memberTwoId:string) => {
    await dbConnect()
    // Now write a query to get the conversation from the conversation collection by querying for memberOneId and memberTwoId. After you find it, return the conversation record with the memberOneId and memberTwoId populated with the member object

    try {
        // Find the conversation by querying for memberOneId and memberTwoId
        const conversation = await Conversation.findOne({
            memberOneId,
            memberTwoId
        }).populate({
            path: 'memberOneId memberTwoId',
            populate: {
                path: 'profile',
            },
        }) // Populate memberOneId and memberTwoId with the member objects and their profiles

        return conversation;
    } catch (error) {
        console.error("Error finding conversation:", error);
        return null;
    }
}


const newConversation = async (memberOneId:string, memberTwoId:string) => {
    await dbConnect()

    try {
        // Create a new conversation
        const conversationCreated = await Conversation.create({
            memberOneId,
            memberTwoId
        });

        const conversation = await Conversation.findById(conversationCreated._id).populate({
            path: 'memberOneId memberTwoId',
            populate: {
                path: 'profile',
            },
        })

        return conversation; // The reason for creating and then finding and populating is it is creating an empty object as well if we populate it on the created object directly.
    } catch (error) {
        console.error("Error creating conversation:", error);
        return null;
    }
}