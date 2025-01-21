import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { createDataset } from "@/app/actions/datasets";
import { DatasetFormData, datasetSchema } from "@/schema";
import { useUser } from "@clerk/nextjs";

interface DatasetInfoBtnProps {
  database: string;
  collection: string;
}

const DatasetInfoBtn = ({ database, collection }: DatasetInfoBtnProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const form = useForm<DatasetFormData>({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      database,
      sample_collection: collection,
      name: "",
      category: "",
      description: "",
      full_description: "",
      use_cases: "",
      tags: "",
      access_type: "Free",
      publish: false,
    },
  });

  const handleSubmit = async (data: DatasetFormData) => {
    if (!user) return;

    setIsLoading(true);

    await createDataset(user.id, data);

    setIsLoading(false);
    setOpen(false)
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="text-white">Dataset Info</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Link Dataset</AlertDialogTitle>
              <AlertDialogDescription className="max-h-[30rem] overflow-auto">
                <FormField
                  control={form.control}
                  name="database"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Database</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sample_collection"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Collection</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="full_description"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="use_cases"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Use Cases</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="access_type"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Access Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select access type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Free" className="cursor-pointer">
                            Free
                          </SelectItem>
                          <SelectItem value="Paid">
                            <div className="opacity-50 cursor-not-allowed">
                              Paid - Coming Soon
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publish"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 mt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="grid gap-1.5 leading-none">
                        <FormLabel className="text-sm font-bold">
                          Publish this dataset
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Toggling publish makes this Dataset publicly available
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <Button disabled={isLoading} type="submit">
                Continue
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DatasetInfoBtn;
