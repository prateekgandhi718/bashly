import CreateItineraryComponent from "@/app/(main)/_components/create-itinerary";
import ItineraryComponent from "@/app/(main)/_components/itinerary-component";
import ChatHeader from "@/components/chat/chat-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { currentProfile } from "@/lib/current-profile";
import dbConnect from "@/lib/dbConnect";
import {
  Bash,
  Itinerary,
  ItineraryDocument,
} from "@/models/BashModels";
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
  const bash = (await Bash.findById(params.bashId).lean()) as any;

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

  const plainItineraries = itineraries.map((iten) => ({
    ...iten,
    _id: iten._id.toString(),
    bash: iten.bash.toString(),
  }))

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
      {!!plainItineraries?.length && (
        <Carousel className="w-full">
          <CarouselContent>
            {plainItineraries.map((itinerary) => (
              <CarouselItem key={itinerary._id}>
                <div className="p-4">
                  <Card>
                    <CardContent className="h-96 p-6 dark:bg-[#2B2D31] bg-[#F2F3F5]">
                      <ItineraryComponent
                        bashId={plainBash._id}
                        itinerary={itinerary}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
};

export default BashIdPage;

// We can a plan a flow like this - fetch all itineries in here. Then map over all the itineraries and then create another server component Itinerary which will recieve the fetched itinerary as a prop. Inside this component we fetch all the events for the itinerary and then pass all the events inside a client component Events as props.

