import winston from "winston";
import fs from 'fs';

// Set the path to the error.log file
const errorLogFilePath = 'error.log';

// Clear the contents of the error.log file
fs.writeFileSync(errorLogFilePath, '');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log',}),
    ],
});


// if (process.env.NODE_ENV !== 'production') {
//     logger.add(
//         new winston.transports.Console({
//             format: winston.format.simple(),
//         })
//     );
// }


export default logger