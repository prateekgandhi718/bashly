// This layout file is inside of the main folder. So whatever you put inside the main folder, this layout will be applied to it. Think of this as, an index.js for the code inside the main folder. Since this app contains auth, we need everything which is inside of the main folder to be protected. So do the redirection logic here.

// Also, it is not an antipattern if you use many client components. Since if there are large number of users in your app, you also have to have large number of client components to execute javascript on thier browsers. If there are a lot of server components, compute would happen on the server and they would charge you for it.

// Making this a server component since we cannot use server component (Navigation) inside a client component since Client Components are rendered after Server Components.

import { redirect } from "next/navigation";
import Navigation from "./_components/navigation";
import { initialProfile } from "@/lib/initial-profile";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const profile = await initialProfile()

  if (!profile) {
    return redirect("/")
  } 

  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Navigation />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
