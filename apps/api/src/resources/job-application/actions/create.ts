import { jobApplicationService } from 'resources/job-application';

import { validateMiddleware } from 'middlewares';

import { JobApplicationUpdatesSchema } from 'schemas';
import { AppKoaContext, AppRouter, JobApplication } from 'types';

type ValidatedData = Omit<JobApplication, '_id'>;

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const data = ctx.validatedData;

  const result = await jobApplicationService.insertOne(data);
  ctx.body = result;
}

export default (router: AppRouter) => {
  router.post('/create', validateMiddleware(JobApplicationUpdatesSchema), handler);
};
