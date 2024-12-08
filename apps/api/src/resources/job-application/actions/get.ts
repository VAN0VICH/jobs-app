import { jobApplicationService } from 'resources/job-application';

import { AppKoaContext, AppRouter } from 'types';

async function handler(
  ctx: AppKoaContext<
    Record<string, unknown>,
    {
      params: {
        id: string;
      };
    }
  >,
) {
  const { id } = ctx.request.params;

  const jobApplication = await jobApplicationService.findOne({
    _id: id,
  });
  if (jobApplication) {
    ctx.body = jobApplication;
    return;
  }
  ctx.status = 404;
}

export default (router: AppRouter) => {
  router.get('/:id', handler);
};
