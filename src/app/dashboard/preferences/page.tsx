"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const preferencesFormSchema = z.object({
  experience: z.coerce.number().min(0, "Experience cannot be negative."),
  careerLevel: z.string({
    required_error: "Please select a career level.",
  }),
  jobTitles: z.array(
    z.object({
      value: z.string().min(1, "Job title cannot be empty."),
    })
  ).min(1, "Please add at least one job title.").max(5, "You can add up to 5 job titles."),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

const defaultValues: Partial<PreferencesFormValues> = {
  experience: 5,
  careerLevel: "mid-level",
  jobTitles: [{ value: "Software Engineer" }],
};

export default function PreferencesPage() {
  const { toast } = useToast();
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "jobTitles",
    control: form.control,
  });

  function onSubmit(data: PreferencesFormValues) {
    toast({
      title: "Preferences Saved!",
      description: "Your job preferences have been updated successfully.",
    });
    console.log(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Preferences</CardTitle>
        <CardDescription>
          Tell us what you're looking for to get the best job matches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="careerLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entry-level">Entry-level</SelectItem>
                        <SelectItem value="mid-level">Mid-level</SelectItem>
                        <SelectItem value="senior-level">Senior-level</SelectItem>
                        <SelectItem value="lead">Lead / Manager</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Top 5 Preferred Job Titles</FormLabel>
              <FormDescription className="mb-4">
                List the job titles you are most interested in.
              </FormDescription>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`jobTitles.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} placeholder={`Job Title #${index + 1}`} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: "" })}
                  disabled={fields.length >= 5}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Job Title
                </Button>
              </div>
               <FormMessage>{form.formState.errors.jobTitles?.message}</FormMessage>
            </div>

            <Button type="submit">Save Preferences</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
