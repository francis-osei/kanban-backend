export {};
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVER_PORT: string;
            NODE_ENV: 'production' | 'development' | 'staging';
            INITIAL_lECT_NUMB: string;
            SALT_ROUND: string;
            DATABASE: string;
            DATABASE_PASSWORD: string;
            JWT_SECRET: string;
            JWT_EPIRES_IN: string;
            JWT_COOKIE_EXPIRES_IN: string;
            EMAIL_ADDRESS: string;
            EMAIL_PASSWORD: string;
            EMAIL_SERVICE: string;
            FRONT_END_URL: string;
            LOGIN_URL: string;
            CLOUDINARY_CLOUD_NAME: string;
            CLOUDINARY_API_KEY: string;
            CLOUDINARY_API_SECRET: string;
        }
    }
}

declare global {
    namespace Express {
        interface User {
            role: string;
        }
    }
}
