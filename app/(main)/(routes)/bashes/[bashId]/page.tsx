import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Bash } from "@/models/BashModels";
import { redirect } from "next/navigation";

// Remember server components already have the params as props.
interface BashIdPageProps {
  params: {
    bashId: string;
  };
}

const BashIdPage = async ({ params }: BashIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/home");
  }

  await dbConnect();

  // Find this bash
  const bash = await Bash.findById(params.bashId);

  if (!bash) {
    return redirect("/home");
  }

  return (
    <ChatHeader
      name={bash.name}
      bashId={bash._id.toString()}
      type="bash"
      imageUrl={bash.imageUrl}
      startDate={bash.startDate}
      endDate={bash.endDate}
    />
  );
};

export default BashIdPage;
