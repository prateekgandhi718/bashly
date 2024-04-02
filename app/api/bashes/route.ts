import { v4 as uuidv4 } from "uuid"
import { currentProfile } from "@/lib/current-profile"
import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import { Bash, Channel, Member } from "@/models/BashModels"

export async function POST(req: Request) {
    try{
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        await dbConnect();
        const newBash = await Bash.create({
            profile: profile._id,
            name: name,
            imageUrl: imageUrl,
            inviteCode: uuidv4(),
        })

        // Create a new channel for this bash named "general" 
        await Channel.create({
            name: "general",
            profile: profile._id,
            bash: newBash._id
        })

        // Make the current user an admin memeber of the bash
        await Member.create({
            role: "ADMIN",
            profile: profile._id,
            bash: newBash._id
        })
        
        return new NextResponse(JSON.stringify({ message: "Bash created successfully" }), { status: 200 })

    } catch (error) {
        console.log("[BASHES_POST]", error)
        return new NextResponse(JSON.stringify({ message: "Internal Server error" }), { status: 500 })
    }
}