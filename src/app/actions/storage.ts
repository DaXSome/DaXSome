'use server';
import {
    PutObjectCommand,
    S3Client,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const uploadFile = async ({
    csv,
    filename,
}: {
    csv: string;
    filename: string;
}) => {
    const bucketName = process.env.AWS_S3_BUCKET!;

    await s3Client.send(
        new DeleteObjectCommand({ Bucket: bucketName, Key: filename })
    );

    const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: csv,
        ContentType: 'text/csv',
    });

    await s3Client.send(uploadCommand);
};
