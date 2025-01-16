import { getUser } from "@/app/actions/user";
import { DatasetMeta } from "@/types";
import { parseDatasetSlug } from "@/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const DatasetCard = ({ dataset }: { dataset: DatasetMeta }) => {
  const isPublished = dataset.status === "published";
  const [user, setUser] = useState<{
    username: string | null;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUser(dataset.user_id);

      setUser(user);
    })();
  }, []);

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
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between mt-auto">
          {!isPublished && <Badge variant={"destructive"}>Coming Soon</Badge>}
          {user && (
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>

              <p>@{user.username}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default DatasetCard;
