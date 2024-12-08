import _ from 'lodash';
import z from 'zod';

import { jobApplicationService } from 'resources/job-application';

import { validateMiddleware } from 'middlewares';

import { JobApplicationUpdates, JobApplicationUpdatesSchema } from 'schemas';
import { AppKoaContext, AppRouter, Next } from 'types';

type ValidatedData = { updates: JobApplicationUpdates; _id: string };
async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { _id } = ctx.validatedData;
  const isJobApplicationExists = await jobApplicationService.exists({ _id });

  ctx.assertError(isJobApplicationExists, `Job application not found with id ${_id}`);

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { _id, updates } = ctx.validatedData;

  const updatedJobApplication = await jobApplicationService.updateOne({ _id }, () => _.pickBy(updates));

  ctx.body = updatedJobApplication;
}

export default (router: AppRouter) => {
  router.post(
    '/update',
    validateMiddleware(z.object({ _id: z.string(), updates: JobApplicationUpdatesSchema })),
    validator,
    handler,
  );
};
