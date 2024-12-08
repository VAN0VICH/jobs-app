import mount from 'koa-mount';

import { jobApplicationRoutes } from 'resources/job-application';

import { AppKoa, AppRouter } from 'types';

const healthCheckRouter = new AppRouter();
healthCheckRouter.get('/health', (ctx) => {
  ctx.status = 200;
});

export default (app: AppKoa) => {
  app.use(healthCheckRouter.routes());
  app.use(mount('/job-applications', jobApplicationRoutes.publicRoutes));
};
