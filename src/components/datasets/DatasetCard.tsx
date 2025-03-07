'use client';

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DatasetInfo } from '@/types';
import { sendGAEvent } from '@next/third-parties/google';
import { useEffect, useState } from 'react';
import { getUser } from '@/app/actions/user';
import Loader from '../Loader';
import { parseDatasetSlug } from '@/utils';

const DatasetCard = ({ dataset }: { dataset: DatasetInfo }) => {
    const metadata = dataset.metadata!;

    const isPending = metadata?.status === 'Pending';

    const [user, setUser] = useState(dataset.user);
    const [isLoading, setIsLoading] = useState(true);

    const handleAnal = () => {
        sendGAEvent({ event: 'ds_view', value: dataset?.metadata.title });
    };

    useEffect(() => {
        (async () => {
            if (user) {
                setIsLoading(false);
                return;
            }

            const userData = await getUser(dataset.user_id);

            setUser(userData);

            setIsLoading(false);
        })();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <Link
            onClick={handleAnal}
            key={dataset._id}
            href={
                isPending
                    ? '#'
                    : `/datasets/@${user.username}/${parseDatasetSlug(`${dataset.metadata?.title} ${user.username}`)}`
            }
        >
            <Card className="border-primary h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="line-clamp-2">
                        {metadata.title}
                    </CardTitle>
                    <CardDescription>{metadata.category}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="mb-4 line-clamp-3">{metadata.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {dataset.metadata?.tags.map((tag) => (
                            <Badge key={tag} className="text-white">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                    {isPending && (
                        <Badge variant={'destructive'}>Coming Soon</Badge>
                    )}

                    <div className="flex gap-2 items-center">
                        <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.username}</AvatarFallback>
                        </Avatar>

                        <p>@{user.username}</p>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default DatasetCard;
