import { serverLogger } from "./logger";

export default () => {
    process.on('unhandledRejection', (reason, promise) => {
        serverLogger('error', 'Unhandled Rejection', reason);
    });

    process.on('uncaughtException', (err) => {
        serverLogger('error', 'Uncaught Exception', err);
    });

};