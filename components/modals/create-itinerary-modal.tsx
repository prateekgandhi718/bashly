"use client";

import qs from "query-string";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUpload from "../file-upload";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name of the itinerary is required.",
    }),
    startDate: z.date({
      required_error: "A start date for the itinerary is required.",
    }),
    endDate: z.date({
      required_error: "An end date for the itinerary is required.",
    }),
  })
  .refine((obj) => obj.endDate >= obj.startDate, {
    path: ["endDate"],
    message: "Time travelling is here?",
  });

const CreateItineraryModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "createItinerary";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const { bash } = data;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/itineraries",
        query: {
          bashId: params?.bashId,
        },
      });
      await axios.post(url, values);

      form.reset();
      router.refresh();
      onClose(); //To close the modal.
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!bash) {
    return (
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-zinc-50 p-0 overflow-hidden">
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className="text-2xl text-center">Oops.</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Which bash are we talking about here?
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-zinc-50 p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center">
            Create an Itinerary for {bash?.name}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Inside an itinerary you'll have your events.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-1 px-6 flex flex-col justify-center items-center gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      Itinerary Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="ring-1 ring-gray-300 dark:ring-neutral-500 focus-visible:ring-1 dark:focus-visible:ring-2 text-black dark:text-white focus-visible:ring-offset-0 w-60 bg-transparent"
                        placeholder="Enter Itinerary name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      Start date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal bg-transparent",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date < bash.startDate ||
                            date > bash.endDate
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      End date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal bg-transparent",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date < form.getValues().startDate ||
                            date > bash.endDate
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-[#313338] px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItineraryModal;
