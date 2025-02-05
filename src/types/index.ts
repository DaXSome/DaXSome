import { getUser } from '@/app/actions/user';
import { Collection } from '@/backend/models/collections';
import { Database } from '@/backend/models/databases';


export interface DatasetInfo extends Database {
  _id:string
    metadata: Collection['metadata'];
    user: Awaited<ReturnType<typeof getUser>>;
}

export type ColumnType = 'string' | 'number' | 'boolean' | 'date' | 'array';

