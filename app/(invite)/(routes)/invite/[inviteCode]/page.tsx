// This won't have any content. It is just going to add you in the bash and redirect you to that bash

import { currentProfile } from "@/lib/current-profile"
import dbConnect from "@/lib/dbConnect"
import { Bash, Member } from "@/models/BashModels"
import { redirect } from "next/navigation"

interface InviteCodePageProps {
    params: {
        inviteCode: string
    }
}

const InviteCodePage = async ({params}: InviteCodePageProps) => {
    const profile = await currentProfile()

    if (!profile) {
        return redirect("/")
    }

    if (!params.inviteCode) {
        return redirect("/")
    }

    // Let's check if the user who is trying to join this bash is already a member of it
    await dbConnect()
    const bash = await Bash.findOne({ inviteCode: params.inviteCode })
    const isUserAlreadyMemberInBash = await Member.findOne({
        profile: profile._id,
        bash: bash._id
    })

    if (isUserAlreadyMemberInBash) {
        return redirect(`/bashes/${bash._id.toString()}`)
    }

    // Adding this person as he is not a member in this bash
    const newMember = new Member({
        profile: profile._id,
        bash: bash._id,
    })
    await newMember.save()

    if (newMember) {
        return redirect(`/bashes/${bash._id.toString()}`)
    }


  return (
    null
  )
}

export default InviteCodePage