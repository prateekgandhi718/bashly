import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
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
  const member = await Member.findOne({
    bash: params.bashId,
    profile: profile._id,
  });

  if (!channel || !member) {
    redirect("/home");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        bashId={channel.bash.toString()}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          {/* <ChatMessages
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
          /> */}
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
      )}
      {/* {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )} */}
      {/* {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )} */}
    </div>
  );
};

export default ChannelIdPage;
