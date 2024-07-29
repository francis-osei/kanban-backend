import mongoose from 'mongoose';

export const getDB_url = () => {
    return (process.env.DATABASE ?? '').replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD ?? ''
    );
};

const database = {
    connect: (DB_url: string) => {
        mongoose.connect(DB_url);

        mongoose.connection.on(
            'error',
            // eslint-disable-next-line no-console
            console.error.bind(console, 'connection error:')
        );

        mongoose.connection.once('open', function () {
            // eslint-disable-next-line no-console
            console.log('Connected to MongoDB');
        });

        mongoose.connection.on('disconnected', function () {
            // eslint-disable-next-line no-console
            console.log('Disconnected from MongoDB');
        });
    },
};

export default database;
