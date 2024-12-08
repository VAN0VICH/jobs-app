import { Database } from '@paralect/node-mongo';

import { DATABASE_DOCUMENTS } from 'app-constants';
import { JobApplicationSchema } from 'schemas';
import { JobApplication } from 'types';

const database = new Database(process.env.MONGO_URL as string);

const jobApplicationService = database.createService<JobApplication>(DATABASE_DOCUMENTS.JOB_APPLICATIONS, {
  schemaValidator: (obj) => JobApplicationSchema.parseAsync(obj),
});

describe('Job application service', () => {
  beforeAll(async () => {
    await database.connect();
  });

  beforeEach(async () => {
    await jobApplicationService.deleteMany({});
  });

  it('should create job application', async () => {
    const mockJobApplication: JobApplication = {
      _id: '123asdqwer',
      company: 'Apple',
      description: '20 years of experience',
      jobTitle: 'Dishwasher',
      status: 'ACCEPTED',
      salaryRange: '100k-200k',
    };

    await jobApplicationService.insertOne(mockJobApplication);

    const insertedJobApplication = await jobApplicationService.findOne({ _id: mockJobApplication._id });

    expect(insertedJobApplication).not.toBeNull();
  });

  afterAll(async () => {
    await database.close();
  });
});
