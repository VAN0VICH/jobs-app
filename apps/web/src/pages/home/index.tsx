import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Button, Modal, ScrollArea, Stack, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { SortDirection } from '@tanstack/react-table';
import { pick } from 'lodash';

import { jobApplicationApi, JobApplicationsListParams } from 'resources/job-application';

import { Table } from 'components';

import { JobApplication } from 'types';

import { JobApplicationComponent } from './components/job-application';
import { CreateJobApplication } from './components/job-application/create-modal';
import { COLUMNS, DEFAULT_PAGE, DEFAULT_PARAMS, EXTERNAL_SORT_FIELDS, PER_PAGE } from './constants';

const Home: NextPage = () => {
  const [params, setParams] = useSetState<JobApplicationsListParams>(DEFAULT_PARAMS);
  const [opened, setOpened] = React.useState(false);
  const [createOpened, setCreateOpened] = React.useState(false);

  const [jobId, setJobId] = React.useState<string>();

  const { data: jobApplications, isLoading } = jobApplicationApi.useList(params);

  const createClose = () => {
    setCreateOpened(false);
  };

  const onSortingChange = (sort: Record<string, SortDirection>) => {
    setParams((prev) => {
      const combinedSort = { ...pick(prev.sort, EXTERNAL_SORT_FIELDS), ...sort };

      return { sort: combinedSort };
    });
  };

  const onRowClick = (job: JobApplication) => {
    setJobId(job._id);
    setOpened(true);
  };

  return (
    <>
      <Head>
        <title>Job applications</title>
      </Head>
      {jobId && <JobApplicationComponent opened={opened} jobId={jobId} setOpened={setOpened} />}
      <Modal
        opened={createOpened}
        onClose={createClose}
        scrollAreaComponent={ScrollArea.Autosize}
        title="New application"
      >
        <CreateJobApplication close={createClose} />
      </Modal>

      <Stack gap="lg">
        <Title order={2}>Job applications</Title>
        {/* <Filters setParams={setParams} /> */}

        <Button onClick={() => setCreateOpened(true)} leftSection={<IconPlus />}>
          Create new
        </Button>
        <Table<JobApplication>
          data={jobApplications?.results}
          totalCount={jobApplications?.count}
          pageCount={jobApplications?.pagesCount}
          page={DEFAULT_PAGE}
          perPage={PER_PAGE}
          columns={COLUMNS}
          isLoading={isLoading}
          onPageChange={(page) => setParams({ page })}
          onSortingChange={onSortingChange}
          onRowClick={onRowClick}
        />
      </Stack>
    </>
  );
};

export default Home;
