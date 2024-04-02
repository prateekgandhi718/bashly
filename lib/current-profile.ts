import dbConnect from "./dbConnect";
import { Profile } from "@/models/BashModels";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";

export const currentProfile = async () => {
  const session = await getServerSession(authOptions) as any

  if (!session) {
    return null
  }

  await dbConnect();

  const profile = await Profile.findOne({userId: session.user?.id})

  return profile

};

// We will use this all through our app to check the current profile and protect our routes.