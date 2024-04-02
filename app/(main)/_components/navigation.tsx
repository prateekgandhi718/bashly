//This is the side navigation bar. Will be a server component since we need to load all the bashes inside of this.

import dbConnect from "@/lib/dbConnect";
import { Bash, Member } from "@/models/BashModels";
import { redirect } from "next/navigation";
import NavigationAction from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import DropdownMenuDemo from "@/components/profileDropdown";

const Navigation = async ({profile}: {profile: any}) => {
  // The redirecting if profile not found has already been handeled in the layout so no need to check in the children components. That acts as a middleware. 

  // Find all the bashes this user is a member of.
  await dbConnect();
  const memberBashes = await Member.find({ profile: profile._id}).populate('bash')
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1b1d20] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {memberBashes.map((memberBash) => (
          <div key={memberBash.bash._id.toString()} className="mb-4">
            <NavigationItem id={memberBash.bash._id.toString()} name={memberBash.bash.name} imageUrl={memberBash.bash.imageUrl}/>
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
          <ModeToggle />
          <DropdownMenuDemo />
      </div>
    </div>
  );
};

export default Navigation;
