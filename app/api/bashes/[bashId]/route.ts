// Patch api to edit a bash name or image url

import { currentProfile } from "@/lib/current-profile"
import dbConnect from "@/lib/dbConnect"
import { Bash, Channel, Member } from "@/models/BashModels"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}: { params: {bashId: string}}) {
    try{
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        // Fetch the bash by its ID
        await dbConnect()
        const bash = await Bash.findById(params.bashId)
        if (!bash) {
            return new NextResponse("Bash not found", { status: 404 })
        }

        // Check if the user is an admin of the bash
        if (bash.profile.toString() !== profile._id.toString()) {
            return new NextResponse("You are not authorized to edit this bash", { status: 403 })
        }

        // Extract the new name and imageUrl from the request body
        const { name, imageUrl } = await req.json()

        // Update the bash with the new name and imageUrl
        bash.name = name
        bash.imageUrl = imageUrl
        await bash.save()

        return new NextResponse("Bash updated successfully", { status: 200 })

    } catch (error) {
        console.error("[BASH_ID_PATCH]", error)
        return new NextResponse("Internal Server Error", { status: 500})
    }
}

export async function DELETE(req: Request, {params}: { params: {bashId: string}}) {
    try{
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        // Fetch the bash by its ID
        await dbConnect()
        const bash = await Bash.findById(params.bashId)
        if (!bash) {
            return new NextResponse("Bash not found", { status: 404 })
        }

        // Check if the user is an admin of the bash
        if (bash.profile.toString() !== profile._id.toString()) {
            return new NextResponse("You are not authorized to delete this bash", { status: 403 })
        }

        // Delete all members associated with this bash
        await Member.deleteMany({ bash: params.bashId });

        // Delete all channels associated with this bash
        await Channel.deleteMany({ bash: params.bashId });

        // Delete the bash
        await Bash.findByIdAndDelete(params.bashId);

        return new NextResponse("Bash deleted successfully", { status: 200 })

    } catch (error) {
        console.error("[BASH_ID_DELETE]", error)
        return new NextResponse("Internal Server Error", { status: 500})
    }
}