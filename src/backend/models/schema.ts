import { supportedDataTypes } from '@/utils';
import mongoose from 'mongoose';



const documentSchema = new mongoose.Schema(
    {
        database: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Database',
            required: true,
        },

        collection: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Collection',
            required: true,
        },

        user_id: {
            type: String,
            required: true,
        },

        schema: [
            {
                name: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    enum: supportedDataTypes,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);


export type DocumentSchema = mongoose.InferSchemaType<typeof documentSchema>;

export const DocumentSchemaModel =
    mongoose.models.DocumentSchemaModel ||
    mongoose.model('DocumentSchemaModel', documentSchema);
