import { redirect } from "next/navigation";
import dbConnect from "./dbConnect";
import { Profile } from "@/models/BashModels";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";

export const initialProfile = async () => {
  const session = await getServerSession(authOptions) as any

  if (!session) {
    return redirect("/");
  }

  await dbConnect();

  const profile = await Profile.findOne({userId: session.user?.id})

  if (profile) {
    return profile;
  }

  const newProfile = await Profile.create({
      userId: session.user?.id,
      name: `${session.user?.name}`,
      imageUrl: session.user?.image || "",
      email: session.user?.email
  });

  return newProfile;
};

//Note: this is a server component and since we are using V4 of Next Auth, we need to pass authOptions to access the session on the server component. 