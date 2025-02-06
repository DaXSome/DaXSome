import { getUser } from '@/app/actions/user';
import { Collection } from '@/backend/models/collections';
import { Database } from '@/backend/models/databases';

export interface DatasetInfo extends Database {
    _id: string;
    slug: Collection['slug'];
    metadata: Collection['metadata'];
    user: Awaited<ReturnType<typeof getUser>>;
}
