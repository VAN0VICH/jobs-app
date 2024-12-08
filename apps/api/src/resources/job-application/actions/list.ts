import { z } from 'zod';

import { jobApplicationService } from 'resources/job-application';

import { validateMiddleware } from 'middlewares';
import { stringUtil } from 'utils';

import { paginationSchema } from 'schemas';
import { AppKoaContext, AppRouter, JobApplication, NestedKeys } from 'types';

const schema = paginationSchema.extend({
  sort: z
    .object({
      company: z.enum(['asc', 'desc']).optional(),
      jobTitle: z.enum(['asc', 'desc']).optional(),
      createdOn: z.enum(['asc', 'desc']).default('asc'),
    })
    .default({}),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { perPage, page, sort, searchValue } = ctx.validatedData;

  const filterOptions = [];

  if (searchValue) {
    const searchPattern = stringUtil.escapeRegExpString(searchValue);

    const searchFields: NestedKeys<JobApplication>[] = ['company', 'jobTitle', 'description'];

    filterOptions.push({
      $or: searchFields.map((field) => ({ [field]: { $regex: searchPattern } })),
    });
  }

  const result = await jobApplicationService.find(
    { ...(filterOptions.length && { $and: filterOptions }) },
    { page, perPage },
    { sort },
  );

  ctx.body = { ...result, results: result.results };
}

export default (router: AppRouter) => {
  router.get('/list', validateMiddleware(schema), handler);
};
