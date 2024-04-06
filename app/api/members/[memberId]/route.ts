import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Member } from "@/models/BashModels";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const bashId = searchParams.get("bashId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bashId) {
      return new NextResponse("Bash ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    await dbConnect();

    // find the member by the memberId and the bashId. also check that the profile attribute of the member is not same as profile_id. (because admin cannot edit his own role) once we have the member, update the role attribute to the role. Then return all the updated members with profile field populated.

    // Find the member by the memberId and the bashId.
    const member = await Member.findOne({
      _id: params.memberId,
      bash: bashId,
      profile: { $ne: profile._id }, // Ensure the profile is not the same as the current user
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Update the role attribute to the role.
    member.role = role;
    await member.save();

    // Return all the updated members with profile field populated.
    const updatedMembers = await Member.find({
      bash: bashId,
    }).populate("profile");

    return NextResponse.json(updatedMembers);
  } catch (error) {
    console.error("[MEMBERS_ID_PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const bashId = searchParams.get("bashId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bashId) {
      return new NextResponse("Bash ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    await dbConnect();

    // find the member by the memberId and the bashId. also check that the profile attribute of the member is not same as profile_id. (because admin cannot delete his own member) once we have the member, delete it. Then return all the updated members with profile field populated.

    // Find the member by the memberId and the bashId.
    const member = await Member.findOne({
      _id: params.memberId,
      bash: bashId,
      profile: { $ne: profile._id }, // Ensure the profile is not the same as the current user
    });

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    // Delete the member
    await member.deleteOne();

    // Return all the updated members with profile field populated.
    const updatedMembers = await Member.find({
      bash: bashId,
    }).populate("profile");

    return NextResponse.json(updatedMembers);
  } catch (error) {
    console.error("[MEMBERS_ID_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
