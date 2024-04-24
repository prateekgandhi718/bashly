import CreateItineraryComponent from "@/app/(main)/_components/create-itinerary";
import ItineraryComponent from "@/app/(main)/_components/itinerary-component";
import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import { Bash, BashDocument, Itinerary, ItineraryDocument } from "@/models/BashModels";
import { redirect } from "next/navigation";

// Remember server components already have the params as props.
interface BashIdPageProps {
  params: {
    bashId: string;
  };
}

const BashIdPage = async ({ params }: BashIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/home");
  }

  await dbConnect();

  // Find this bash
  const bash = await Bash.findById(params.bashId).lean() as any

  if (!bash) {
    return redirect("/home");
  }

  // This is a server component, here fetch all the details about the itineraries already present and all the events present inside them. Pass those as props to the client compoenents which will display the itineraries and its events.

  // Find all itineraries present in the bash.
  const itineraries = (await Itinerary.find({
    bash: bash._id,
  }).lean()) as ItineraryDocument[];

  // Converting to plain objects
  const plainBash = {
    ...bash,
    _id: bash._id.toString(),
    profile: bash.profile.toString(), 
  };
  return (
    <div>
      <ChatHeader
        name={bash.name}
        bashId={bash._id.toString()}
        type="bash"
        imageUrl={bash.imageUrl}
        startDate={bash.startDate}
        endDate={bash.endDate}
      />
      <CreateItineraryComponent bash={plainBash} />
      {!!itineraries?.length && (
        itineraries.map((itinerary) => (
          <ItineraryComponent key={itinerary._id.toString()} bashId={bash._id.toString()} itineraryId={itinerary._id.toString()}  />
        ))
      )}
    </div>
  );
};

export default BashIdPage;

// We can a plan a flow like this - fetch all itineries in here. Then map over all the itineraries and then create another server component Itinerary which will recieve the fetched itinerary as a prop. Inside this component we fetch all the events for the itinerary and then pass all the events inside a client component Events as props.


// carousel

// return (
//   <Carousel className="w-full max-w-xs">
//     <CarouselContent>
//       {Array.from({ length: 5 }).map((_, index) => (
//         <CarouselItem key={index}>
//           <div className="p-1">
//             <Card>
//               <CardContent className="flex aspect-square items-center justify-center p-6">
//                 <span className="text-4xl font-semibold">{index + 1}</span>
//               </CardContent>
//             </Card>
//           </div>
//         </CarouselItem>
//       ))}
//     </CarouselContent>
//     <CarouselPrevious />
//     <CarouselNext />
//   </Carousel>
// )