import mongoose, { Document } from 'mongoose';

const metadataSchema = new mongoose.Schema(
    {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        tags: { type: [String], default: [] },
        category: { type: String, default: '' },
        access_type: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
        full_description: { type: String, default: '' },
        status: {
            type: String,
            enum: ['Pending', 'Unpublished', 'Published'],
            default: 'Unpublished',
        },
    },
    { _id: false }
);

const collectionSchema = new mongoose.Schema(
    {
        database: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Database',
            default: '',
        },

        user_id: {
            type: String,
            default: '',
        },

        name: {
            type: String,
            default: 'Untitled',
        },

        slug: {
            type: String,
            default: '',
        },

        metadata: {
            type: metadataSchema,

            default: {},
        },

        asset_url: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

export type Collection = mongoose.InferSchemaType<typeof collectionSchema> &
    Document;

export const CollectionModel =
    mongoose.models.Collection ||
    mongoose.model('Collection', collectionSchema);
