import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { ChannelType } from "@/helpers/types";
import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Channel, ChannelDocument, Member } from "@/models/BashModels";
import { redirect } from "next/navigation";

// Server components have the url params automatically available so no need to use useParams. just make sure to name the props the same as the folder structure.

interface ChannelIdPageProps {
  params: {
    bashId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/home");
  }

  await dbConnect();

  // Find this channel
  const channel = (await Channel.findById(params.channelId)) as ChannelDocument;

  // Find this member in this bash
  const member = (await Member.findOne({
    bash: params.bashId,
    profile: profile._id,
  }).lean()) as any;

  if (!channel || !member) {
    redirect("/home");
  }

  if (member) {
    member._id = member._id.toString();
    member.profile = member.profile.toString();
    member.bash = member.bash.toString();
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        bashId={channel.bash.toString()}
        type="channel"
      />

      <>
        <ChatMessages
          member={member}
          name={channel.name}
          chatId={channel._id.toString()}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: channel._id.toString(),
            bashId: channel.bash.toString(),
          }}
          paramKey="channelId"
          paramValue={channel._id.toString()}
        />
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel._id.toString(),
            bashId: channel.bash.toString(),
          }}
        />
      </>
    </div>
  );
};

export default ChannelIdPage;
