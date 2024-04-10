import { loadingMessagesArray, pickRandomLoadingString } from "@/helpers/loadingMessagesArray";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {pickRandomLoadingString(loadingMessagesArray)}
      </p>
    </div>
  );
};

export default Loading;
