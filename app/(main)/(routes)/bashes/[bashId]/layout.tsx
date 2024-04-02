import BashSidebar from "@/app/(main)/_components/bash-sidebar";
import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Bash, Member } from "@/models/BashModels";
import { redirect } from "next/navigation";

const BashIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { bashId: string };
}) => {
  const profile = await currentProfile()
  if (!profile) {
    return redirect("/")
  }

  // Now we need to find bash not just by the id which is present in the URL but the current user should also be a member of this bash so that other users(who know the id of the bash) who are not a member cannot access it.

  await dbConnect();
  const bash = Bash.findById(params.bashId)
  if (!bash) {
    // Bash not found
    return redirect("/")
  }
  const member = await Member.findOne({ profile: profile._id, bash: params.bashId})
  if (!member) {
    // User is not a member of this bash
    return redirect("/")
  }

  return ( 
    <div className="h-full">
      <div 
      className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <BashSidebar bashId={params.bashId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
   );
};

export default BashIdLayout;
