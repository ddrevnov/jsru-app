import * as mongoose from 'mongoose';
import * as mongooseBeautifulUniqueValidation from 'mongoose-beautiful-unique-validation';
import logger from '../utils/logger';
import config from '../utils/config';

const MONGO_URI: string = config.mongodb.uri;

mongoose.plugin(mongooseBeautifulUniqueValidation);
mongoose.connect(MONGO_URI, () => {
  logger.info(`mongodb is running on ${MONGO_URI}`);
});

mongoose.set('useCreateIndex', true);

export default mongoose;
