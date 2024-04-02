import InitialModal from "@/components/modals/initial-modal"
import dbConnect from "@/lib/dbConnect"
import { initialProfile } from "@/lib/initial-profile"
import { Bash, Member } from "@/models/BashModels"
import { redirect } from "next/navigation"

const SetupPage = async () => {
  const profile = await initialProfile()
  await dbConnect()
  let redirectPath = null
  // Find first bash that this user is a member of!
  try {
    // Find the member document for this user
    const member = await Member.findOne({profile: profile._id})
    if (member) {
      // If the memeber is found, find the associated bash
      const bash = await Bash.findById(member.bash)
      if (bash) {
        redirectPath = `/bashes/${bash._id}`
      }
    }
  } catch (error) {
    console.error("Error finding a bash for this user: ", error)
  } finally {
    if (redirectPath) {
      redirect(redirectPath)
    }
  }

  // If no bash is found, return Initial modal
  return <InitialModal />
}

export default SetupPage

// NOTE: DO NOT USE redirect INSIDE TRY CATCH BLOCKS.