import { initialProfile } from "@/lib/initial-profile"

const SetupPage = async () => {
  const profile = await initialProfile()
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">

      <h2 className="text-lg font-medium">
        {profile.name}
      </h2>

    </div>
  )
}

export default SetupPage