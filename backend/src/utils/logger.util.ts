import devLogger from './devLogger.util';
import prodLogger from './prodLogger.util';

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export default logger;