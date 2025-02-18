import mongoose from 'mongoose';

/* eslint-disable no-var */
declare global {
    var mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
    };
}

const cached =
    global.mongoose || (global.mongoose = { conn: null, promise: null });

export default async function connectToDb() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.DB_URI as string, {
                dbName: 'entries',
            })
            .then((mongooseInstance) => mongooseInstance.connection);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
