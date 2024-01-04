import app from './app';
import logger from './logger/logs';

app.listen(4040, () => {
    logger.info('Application listening a port 4040');
});
