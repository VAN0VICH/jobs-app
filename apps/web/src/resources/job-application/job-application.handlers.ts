import { apiService } from 'services';

import queryClient from 'query-client';

import { JobApplication } from 'types';

apiService.on('error', (error) => {
  if (error.status === 401) {
    queryClient.setQueryData<JobApplication | null>(['job-applications'], null);
  }
});
