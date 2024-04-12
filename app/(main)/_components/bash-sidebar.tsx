import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import {
  Bash,
  Channel,
  ChannelDocument,
  Member,
  MemberDocument,
} from "@/models/BashModels";
import { redirect } from "next/navigation";
import BashHeader from "./bash-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import BashSearch from "./bash-search";
import { ChannelType, MemberRole } from "@/helpers/types";
import {
  Hash,

  Monitor,
  ShieldAlert,
  ShieldCheck,

} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BashSection from "./bash-section";
import BashChannel from "./bash-channel";
import BashMember from "./bash-member";

interface BashSidebarProps {
  bashId: string;
}

const iconMap = {
  [ChannelType.SYSTEM]: <Monitor className="mr-2 h-4 w-4" />,
  [ChannelType.OPEN]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.MODS]: <ShieldCheck className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldCheck className="h-4 w-4 mr-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldAlert className="h-4 w-4 mr-2 text-indigo-500" />
  ),
};

const BashSidebar = async ({ bashId }: BashSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  // Now we are going to fetch the bash again even though we already did that in our layout. Because, we will use this in our mobile screen so want this to be independent.
  await dbConnect();
  const bash = (await Bash.findById(bashId).lean()) as any; // To convert into js object.
  // Now fetch all the channels in this bash. order them by createdAt ascending.
  const channelsInBash = (await Channel.find({ bash: bashId })
    .sort({ createdAt: 1 })
    .lean()) as ChannelDocument[];

  // Then fetch all the members in for this bash. it should have all the details of the profile. order them by their role.
  const allMembersInBash = (await Member.find({ bash: bashId })
    .populate("profile")
    .sort({ role: 1 })
    .lean()) as any;

  // Converting channels to strings
  const plainChannelsInBash = channelsInBash.map((channel) => ({
    ...channel,
    _id: channel._id.toString(),
    profile: channel.profile.toString(),
    bash: channel.bash.toString(),
  }));
  // Categorizing channels
  const openChannels = plainChannelsInBash.filter(
    (channel) => channel.type === ChannelType.OPEN
  );
  const modsChannels = plainChannelsInBash.filter(
    (channel) => channel.type === ChannelType.MODS
  );
  const systemChannels = plainChannelsInBash.filter(
    (channel) => channel.type === ChannelType.SYSTEM
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

  const plainMembersInBashExcludingUs = plainMembersInBash.filter(
    (member: any) => member.profile._id !== profile._id.toString()
  ); //Removing ourselves in the members.
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
                label: "Open Channels",
                type: "channel",
                data: openChannels?.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Mods Only",
                type: "channel",
                data: modsChannels?.map((channel) => ({
                  id: channel._id.toString(),
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: plainMembersInBash?.map((member: any) => ({
                  id: member._id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role as MemberRole],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {/* double exclaimation just gives you a certain false or truth. */}
        {!!systemChannels?.length && (
          <div className="mb-2">
            <BashSection
              sectionType="channels"
              channelType={ChannelType.SYSTEM}
              role={ourRole}
              label="System Channels"
            />
            <div className="space-y-[2px]">
              {systemChannels.map((channel) => (
                <BashChannel
                  key={channel._id}
                  channel={channel as any}
                  role={ourRole}
                  bash={bashWithStrings}
                />
              ))}
            </div>
          </div>
        )}
        {!!openChannels?.length && (
          <div className="mb-2">
            <BashSection
              sectionType="channels"
              channelType={ChannelType.OPEN}
              role={ourRole}
              label="Open Channels"
            />
            <div className="space-y-[2px]">
              {openChannels.map((channel) => (
                <BashChannel
                  key={channel._id}
                  channel={channel as any}
                  role={ourRole}
                  bash={bashWithStrings}
                />
              ))}
            </div>
          </div>
        )}
        {!!modsChannels?.length && ourRole !== MemberRole.GUEST && (
          <div className="mb-2">
            <BashSection
              sectionType="channels"
              channelType={ChannelType.MODS}
              role={ourRole}
              label="Mods Only"
            />
            <div className="space-y-[2px]">
              {modsChannels.map((channel) => (
                <BashChannel
                  key={channel._id}
                  channel={channel as any}
                  role={ourRole}
                  bash={bashWithStrings}
                />
              ))}
            </div>
          </div>
        )}
        {/* Now for members */}
        {!!plainMembersInBashExcludingUs?.length && (
          <div className="mb-2">
            <BashSection
              sectionType="members"
              role={ourRole}
              label="Members"
              bash={bashWithStrings}
              members={plainMembersInBash}
            />
            <div className="space-y-[2px]">
              {plainMembersInBashExcludingUs.map((member: any) => (
                <BashMember key={member._id} member={member} bash={bashWithStrings} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default BashSidebar;

// The flow of data is like this - the data from the DB is fetched in this Server component. The data is then passed inside the BashHeader client component. When you click on the dropdown of manage members etc, then we update the zustand state by using onOpen action.
