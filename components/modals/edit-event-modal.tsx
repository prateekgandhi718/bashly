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
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DateTimePicker } from "../ui/date-time-picker";
import EmojiPicker from "../emoji-picker";
import { useEffect } from "react";

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name of the event is required.",
    }),
    startDateTime: z.date({
      required_error: "A start date for the event is required.",
    }),
    endDateTime: z.date({
      required_error: "An end date for the event is required.",
    }),
    description: z.string(),
    logo: z.string(),
  })
  .refine((obj) => obj.endDateTime >= obj.startDateTime, {
    path: ["endDateTime"],
    message: "Time travelling is here?",
  });

const EditEventModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "editEvent";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDateTime: new Date(),
      endDateTime: new Date(),
      description: "",
      logo: "",
    },
  });

  const { event } = data;

  // Add a useEffect hook to fill the values for the event in the form
  useEffect(() => {
    if (event) {
      form.setValue("name", event.name);
      form.setValue("logo", event.logo);
      form.setValue("description", event.description);
      form.setValue("startDateTime", event.startDateTime);
      form.setValue("endDateTime", event.endDateTime);
    }
  }, [event, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/events",
        query: {
          bashId: params?.bashId,
          eventId: event?._id,
        },
      });
      await axios.patch(url, values);

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

  if (!event) {
    return (
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-zinc-50 p-0 overflow-hidden">
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className="text-2xl text-center">Oops.</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Which Event are we talking about here?
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
            Edit {event.name}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Edit the event's details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-1 px-6 flex flex-col justify-center items-center gap-2">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row">
                      {field.value && (
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 mr-2">
                          {field.value}
                        </div>
                      )}
                      <FormControl>
                        <EmojiPicker onChange={field.onChange} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      Event Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="ring-1 ring-gray-300 dark:ring-neutral-500 focus-visible:ring-1 dark:focus-visible:ring-2 text-black dark:text-white focus-visible:ring-offset-0 w-60 bg-transparent"
                        placeholder="Enter Event name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500">
                      Event Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="ring-1 ring-gray-300 dark:ring-neutral-500 focus-visible:ring-1 dark:focus-visible:ring-2 text-black dark:text-white focus-visible:ring-offset-0 w-60 bg-transparent"
                        placeholder="Enter description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel
                      htmlFor="startDateTime"
                      className="uppercase text-xs font-bold text-zinc-500"
                    >
                      Start date & time
                    </FormLabel>

                    <FormControl>
                      <DateTimePicker
                        granularity="minute"
                        jsDate={field.value}
                        onJsDateChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel
                      htmlFor="endDateTime"
                      className="uppercase text-xs font-bold text-zinc-500"
                    >
                      End date & time
                    </FormLabel>

                    <FormControl>
                      <DateTimePicker
                        granularity="minute"
                        jsDate={field.value}
                        onJsDateChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-red-800" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-[#313338] px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
