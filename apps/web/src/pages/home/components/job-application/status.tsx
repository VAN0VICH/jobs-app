import React from 'react';
import { Badge } from '@mantine/core';

import type { JobApplication } from 'types';

export const StatusComponent = ({ status }: { status: JobApplication['status'] }) => {
  if (status === 'ACCEPTED') {
    return (
      <Badge color="green" size="lg">
        Accepted
      </Badge>
    );
  }
  if (status === 'APPLIED') {
    return (
      <Badge color="yellow" size="lg">
        Applied
      </Badge>
    );
  }
  if (status === 'INTERVIEW') {
    return (
      <Badge color="blue" size="lg">
        Interview
      </Badge>
    );
  }
  return (
    <Badge color="red" size="lg">
      Rejected
    </Badge>
  );
};
