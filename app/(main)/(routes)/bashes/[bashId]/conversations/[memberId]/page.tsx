import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConverastion } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Member } from "@/models/BashModels";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    bashId: string;
  };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/home");
  }

  await dbConnect();
  const currentMember = await Member.findOne({
    bash: params.bashId,
    profile: profile._id,
  }).populate("profile").lean() as any;

  if (!currentMember) {
    return redirect("/home");
  }

  if (currentMember) {
    currentMember._id = currentMember._id.toString();
    currentMember.profile._id = currentMember.profile._id.toString();
    currentMember.bash = currentMember.bash.toString();
  }

  const conversation = await getOrCreateConverastion(
    currentMember._id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/bashes/${params.bashId}`);
  }

  const { memberOneId, memberTwoId } = conversation;

  const otherMember =
    memberOneId.profile._id.toString() === profile._id.toString()
      ? memberTwoId
      : memberOneId; // Rember if comparing _id, make sure to convert to string.

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        bashId={params.bashId}
        type="conversation"
      />
      <>
        <ChatMessages
          member={currentMember}
          name={otherMember.profile.name}
          chatId={conversation._id.toString()}
          type="conversation"
          apiUrl="/api/direct-messages"
          paramKey="conversationId"
          paramValue={conversation._id.toString()}
          socketUrl="/api/socket/direct-messages"
          socketQuery={{
            conversationId: conversation._id.toString(),
          }}
        />
        <ChatInput
          name={otherMember.profile.name}
          type="conversation"
          apiUrl="/api/socket/direct-messages"
          query={{
            conversationId: conversation.id.toString(),
          }}
        />
      </>
    </div>
  );
};

export default MemberIdPage;
