import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Navigation from "@/app/(main)/_components/navigation";
import BashSidebar from "@/app/(main)/_components/bash-sidebar";

const MobileToggle = ({ bashId }: { bashId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden -ml-2 mr-2">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        {/* the empty span is added so that the focus on add buttton should be prevented when the sheet is opened. We could have used onOpenAutoFocus={(e) => e.preventDefault()} on Sheet content but since we are using this on server side we cannot use event handlers!  */}
        <span tabIndex={0}></span> 
        <div className="w-[72px]">
          <Navigation />
        </div>
        <BashSidebar bashId={bashId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
