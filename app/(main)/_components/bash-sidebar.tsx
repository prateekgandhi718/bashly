import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Bash, Channel, ChannelDocument, Member, MemberDocument } from "@/models/BashModels";
import { redirect } from "next/navigation";
import BashHeader from "./bash-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import BashSearch from "./bash-search";
import { ChannelType, MemberRole } from "@/helpers/types";
import { Hash, Mic, Monitor, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface BashSidebarProps {
  bashId: string;
}

const iconMap = {
  [ChannelType.SYSTEM]: <Monitor className="mr-2 h-4 w-4"/>,
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldCheck className="h-4 w-4 mr-2 text-rose-500" />,
  [MemberRole.MODERATOR]: <ShieldAlert className="h-4 w-4 mr-2 text-indigo-500" />,
}

const BashSidebar = async ({ bashId }: BashSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  // Now we are going to fetch the bash again even though we already did that in our layout. Because, we will use this in our mobile screen so want this to be independent.
  await dbConnect();
  const bash = (await Bash.findById(bashId).lean()) as any; // To convert into js object.
  // Now fetch all the channels in this bash. order them by createdAt ascending.
  const channelsInBash = await Channel.find({ bash: bashId })
    .sort({ createdAt: 1 })
    .lean() as ChannelDocument[]
  // Then fetch all the members in for this bash. it should have all the details of the profile. order them by their role.
  const allMembersInBash = (await Member.find({ bash: bashId })
    .populate("profile")
    .sort({ role: 1 })
    .lean()) as any;
  const membersInBash = allMembersInBash.filter(
    (member: any) => member.profile.toString() !== profile._id.toString()
  ); //Removing ourselves in the members.

  // Categorizing channels
  const textChannels = channelsInBash.filter(
    (channel) => channel.type === "TEXT"
  );
  const audioChannels = channelsInBash.filter(
    (channel) => channel.type === "AUDIO"
  );
  const videoChannels = channelsInBash.filter(
    (channel) => channel.type === "VIDEO"
  );
  const systemChannels = channelsInBash.filter(
    (channel) => channel.type === "SYSTEM"
  );

  if (!bash) {
    return redirect("/");
  }

  const bashWithStrings = {
    ...bash,
    _id: bash._id.toString(), // Convert _id to string
    profile: bash.profile.toString(), // Convert profile to string because we are passing it as a prop.
  };
  //Now let's see what our role is in this bash
  const ourRole = allMembersInBash.find(
    (member: any) => member.profile._id.toString() === profile._id.toString()
  )?.role;

  // Convert member profile and bash properties to strings
  const plainMembersInBash = allMembersInBash.map((member: any) => ({
    ...member,
    _id: member._id.toString(),
    profile: { ...member.profile, _id: member.profile._id.toString() }, // Convert profile._id to string
    bash: member.bash.toString(), // Convert bash to string
  }));

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <BashHeader
        bash={bashWithStrings}
        role={ourRole}
        members={plainMembersInBash}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <BashSearch 
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Members",
                type: "member",
                data: plainMembersInBash?.map((member:any) => ({
                  id: member._id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role as MemberRole],
                }))
              },
            ]}
          />
        </div>

      </ScrollArea>
    </div>
  );
};

export default BashSidebar;

// The flow of data is like this - the data from the DB is fetched in this Server component. The data is then passed inside the BashHeader client component. When you click on the dropdown of manage members etc, then we update the zustand state by using onOpen action. 