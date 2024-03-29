import InitialModal from "@/components/modals/initial-modal"
import dbConnect from "@/lib/dbConnect"
import { initialProfile } from "@/lib/initial-profile"
import { Bash } from "@/models/BashModels"
import { redirect } from "next/navigation"

const SetupPage = async () => {
  const profile = await initialProfile()
  // Find first bash that this user is a member of!
  await dbConnect()
  const bash = await Bash.findOne({members: profile._id}).populate("members")

  if (bash) {
    return redirect(`/bashes/${bash._id}`)
  }
  return (
    <InitialModal />
  )
}

export default SetupPage