import { authOptions } from "@/helpers/authOptions";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = async () => {
   const session = await getServerSession(authOptions) as any
   const userId = session.user?.id
   if (!userId) throw new Error("Unauthorized!")
   return {userId: userId}
}
 

export const ourFileRouter = {
    bashImage: f( {image: { maxFileSize: "2MB", maxFileCount: 1}})
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
    messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;