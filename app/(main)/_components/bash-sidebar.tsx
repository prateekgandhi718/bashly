import { currentProfile } from "@/lib/current-profile"
import dbConnect from "@/lib/dbConnect"
import { Bash, Channel, Member } from "@/models/BashModels"
import { redirect } from "next/navigation"
import BashHeader from "./bash-header"

interface BashSidebarProps {
    bashId: string
}

const BashSidebar = async({bashId}: BashSidebarProps) => {
    const profile = await currentProfile()
    if (!profile) {
        return redirect("/")
    }

    // Now we are going to fetch the bash again even though we already did that in our layout. Because, we will use this in our mobile screen so want this to be independent.
    await dbConnect()
    const bash = await Bash.findById(bashId).lean() as any// To convert into js object.
    // Now fetch all the channels in this bash. order them by createdAt ascending. 
    const channelsInBash = await Channel.find({ bash: bashId }).sort({ createdAt: 1 }).lean()
    // Then fetch all the members in for this bash. it should have all the details of the profile. order them by their role.
    const allMembersInBash = await Member.find({ bash: bashId }).populate('profile').sort({ role: 1}).lean()
    const membersInBash = allMembersInBash.filter((member) => member.profile !== profile._id) //Removing ourselves in the members.

    // Categorizing channels
    const textChannels = channelsInBash.filter((channel) => channel.type === 'TEXT')
    const audioChannels = channelsInBash.filter((channel) => channel.type === 'AUDIO')
    const videoChannels = channelsInBash.filter((channel) => channel.type === 'VIDEO')
    const systemChannels = channelsInBash.filter((channel) => channel.type === 'SYSTEM')

    if (!bash) {
        return redirect("/")
    }

    const bashWithStrings = {
        ...bash,
        _id: bash._id.toString(), // Convert _id to string
        profile: bash.profile.toString(), // Convert profile to string because we are passing it as a prop.
    };
    //Now let's see what our role is in this bash
    const ourRole = allMembersInBash.find((member) => member.profile._id.toString() === profile._id.toString())?.role

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <BashHeader bash={bashWithStrings} role={ourRole} />
    </div>
  )
}

export default BashSidebar