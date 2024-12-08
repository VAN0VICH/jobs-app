import z from 'zod';

import { jobApplicationService } from 'resources/job-application';

import { validateMiddleware } from 'middlewares';

import { AppKoaContext, AppRouter, Next } from 'types';

type ValidatedData = { _id: string | string[] };

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { _id } = ctx.validatedData; // Accessing the query `id` which can be an array
  if (!_id || _id.length === 0) {
    ctx.throw(400, 'No IDs provided');
  }

  const doJobApplicationsExist = await jobApplicationService.exists({
    ...(typeof _id === 'string' ? { _id } : { _id: { $in: _id } }),
  });

  ctx.assertError(doJobApplicationsExist, `Job application not found with id ${_id}`);

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { _id } = ctx.validatedData; // Accessing the query `id` which can be an array
  const result = await jobApplicationService.deleteSoft({
    ...(typeof _id === 'string' ? { _id } : { _id: { $in: _id } }),
  });

  ctx.body = result;
}

export default (router: AppRouter) => {
  router.post('/delete', validateMiddleware(z.object({ _id: z.string().or(z.array(z.string())) })), validator, handler);
};
