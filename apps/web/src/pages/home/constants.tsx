import React from 'react';
import { Flex } from '@mantine/core';
import { ColumnDef } from '@tanstack/react-table';

import { JobApplicationsListParams, JobApplicationsListSortParams } from 'resources/job-application';

import { JobApplication } from 'types';

import { StatusComponent } from './components/job-application/status';

export const DEFAULT_PAGE = 1;
export const PER_PAGE = 10;
export const EXTERNAL_SORT_FIELDS: Array<keyof JobApplicationsListSortParams> = ['createdOn'];

export const DEFAULT_PARAMS: JobApplicationsListParams = {
  page: DEFAULT_PAGE,
  searchValue: '',
  perPage: PER_PAGE,
  sort: {
    createdOn: 'desc',
  },
};

export const COLUMNS: ColumnDef<JobApplication>[] = [
  {
    accessorKey: 'company',
    header: 'Company',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'jobTitle',
    header: 'Job Title',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'description',
    header: 'Job Description',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { status } = row.original;

      if (!status) {
        return null;
      }

      return (
        <Flex align="center" w="100px">
          <StatusComponent status={status} />
        </Flex>
      );
    },
  },
  {
    accessorKey: 'salaryRange',
    header: 'Salary',
    cell: (info) => info.getValue(),
  },
];
