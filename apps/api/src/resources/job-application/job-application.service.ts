import db from 'db';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { JobApplicationSchema } from 'schemas';
import { JobApplication } from 'types';

const service = db.createService<JobApplication>(DATABASE_DOCUMENTS.JOB_APPLICATIONS, {
  schemaValidator: (obj) => JobApplicationSchema.parseAsync(obj),
});

export default Object.assign(service, {});
