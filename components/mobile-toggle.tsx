import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Navigation from "@/app/(main)/_components/navigation";
import BashSidebar from "@/app/(main)/_components/bash-sidebar";

const MobileToggle = ({ bashId }: { bashId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <Navigation />
        </div>
        <BashSidebar bashId={bashId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
