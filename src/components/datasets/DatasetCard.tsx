import { getUser } from "@/app/actions/user";
import { parseDatasetSlug } from "@/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DatasetInfo } from "@/types";

const DatasetCard = ({ dataset }: { dataset: DatasetInfo }) => {
  const isPublished = dataset.status === "published";

  return (
    <Link
      key={dataset._id}
      href={!isPublished ? "#" : `/datasets/${parseDatasetSlug(dataset.name)}`}
      className="h-full"
    >
      <Card className="border-primary h-full flex flex-col">
        <CardHeader>
          <CardTitle className="line-clamp-2">{dataset.name}</CardTitle>
          <CardDescription>{dataset.category}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="mb-4 line-clamp-3">{dataset.description}</p>
          <div className="flex flex-wrap gap-2">
            {dataset.tags.map((tag) => (
              <Badge key={tag} className="text-white">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between mt-auto">
          {!isPublished && <Badge variant={"destructive"}>Coming Soon</Badge>}

          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src={dataset.user.avatar} />
              <AvatarFallback>{dataset.user.username}</AvatarFallback>
            </Avatar>

            <p>@{dataset.user.username}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DatasetCard;
