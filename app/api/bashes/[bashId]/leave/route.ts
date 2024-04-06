import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Bash, Member } from "@/models/BashModels";
import { NextResponse } from "next/server";



export async function PATCH(
  req: Request,
  { params }: { params: { bashId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.bashId) {
      return new NextResponse("Bash ID missing", { status: 400 });
    }

    await dbConnect()

    // Retrieve the bash document
    const bash = await Bash.findById(params.bashId);

    if (!bash) {
      return new NextResponse("Bash not found", { status: 404 });
    }

    // Check if the user is an admin of the bash
    if (bash.profile.toString() === profile._id.toString()) {
      return new NextResponse("Admins cannot leave the bash", { status: 403 });
    }

    // If the user is not an admin, remove the user from the members collection
    await Member.findOneAndDelete({ bash: params.bashId, profile: profile._id });
    
    return new NextResponse("Left the bash successfully", { status: 200 });
  } catch (error) {
    console.log("[SERVER_ID_LEAVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}