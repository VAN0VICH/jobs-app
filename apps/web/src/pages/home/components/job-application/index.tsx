import React from 'react';
import {
  Box,
  Button,
  Flex,
  Loader,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconCheck, IconEdit, IconTrash } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { jobApplicationApi } from 'resources/job-application';

import { handleApiError } from 'utils';
import { createRangeString, parseRangeString } from 'utils/format';
import { formatDateToMinsk } from 'utils/time';

import { JobApplicationUpdates, JobApplicationUpdatesSchema } from 'schemas';
import type { JobApplication } from 'types';

import { StatusComponent } from './status';

export const JobApplicationComponent = ({
  jobId,
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  jobId: string;
}) => {
  const { data: job, isLoading } = jobApplicationApi.useGet(jobId, {
    enabled: !!jobId,
  });

  const [editMode, setEditMode] = React.useState(false);

  const close = () => {
    setOpened(false);
    setEditMode(false);
  };
  const { from, to } = React.useMemo(
    () => (job?.salaryRange ? parseRangeString(job?.salaryRange) : { from: 0, to: 100000 }),
    [job],
  );

  const {
    register,
    formState: { errors },
    control,
    setError,
    getValues,
    reset,
  } = useForm<JobApplicationUpdates & { from?: number; to?: number }>({
    defaultValues: job ? { ...job, from, to } : {},
    resolver: zodResolver(
      JobApplicationUpdatesSchema.extend({
        from: z.number().optional(),
        to: z.number().optional(),
      }),
    ),
  });

  const { mutate: update, isPending } = jobApplicationApi.useUpdate();
  const { mutate: deleteJob, isPending: isDeletePending } = jobApplicationApi.useDelete();

  React.useEffect(() => {
    if (job) {
      reset(job); // Update form values when the job data is available
    }
  }, [job, reset]);

  const onSave = React.useCallback(async () => {
    const values = getValues();
    let salaryRange: string | undefined;

    if (!job) return;
    if (values.from || values.to) {
      const fromValue = values.from ?? parseRangeString(job.salaryRange).from;
      const toValue = values.to ?? parseRangeString(job.salaryRange).to;
      salaryRange = createRangeString(fromValue, toValue);
    }
    const companyValueChanged = values.company && values.company !== job.company;
    const descriptionChanged = values.description && values.description !== job.description;
    const jobTitleChanged = values.jobTitle && values.jobTitle !== job.jobTitle;
    const salaryRangeChanged = salaryRange && salaryRange !== job.salaryRange;
    const statusChanged = values.status && values.status !== job.status;
    const noteChanged = values.note !== undefined && values.note !== job.note;
    if (
      companyValueChanged ||
      descriptionChanged ||
      jobTitleChanged ||
      salaryRangeChanged ||
      statusChanged ||
      noteChanged
    ) {
      update(
        {
          _id: job._id,
          updates: {
            ...(descriptionChanged && {
              description: values.description,
            }),
            ...(jobTitleChanged && { jobTitle: values.jobTitle }),
            ...(companyValueChanged && { company: values.company }),
            ...(statusChanged && { status: values.status }),
            ...(salaryRangeChanged && { salaryRange }),
            ...(noteChanged && {
              note: values.note,
            }),
          },
        },
        {
          onError: (e) => {
            handleApiError(e, setError);
          },
          onSuccess() {
            showNotification({
              title: 'Success',
              message: `Job application has been updated!`,
              color: 'green',
            });
          },
        },
      );
    }
    setEditMode(false);
  }, [job]);
  const onDelete = React.useCallback(async () => {
    job?._id &&
      deleteJob(
        {
          _id: job._id,
        },
        {
          onSuccess() {
            showNotification({
              title: 'Success',
              message: `Job application has been deleted!`,
              color: 'green',
            });
            setEditMode(false);
            setOpened(false);
          },
        },
      );
  }, [job?._id]);

  if (!job && !isLoading) {
    return null;
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <Modal.Root opened={opened} onClose={close} scrollAreaComponent={ScrollArea.Autosize} size="lg">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Job application</Modal.Title>
          <Flex gap={10}>
            <Button
              variant="filled"
              size="sm"
              color="red"
              leftSection={isDeletePending ? <Loader size={14} /> : <IconTrash size={14} />}
              onClick={onDelete}
            >
              Delete
            </Button>
            <Button
              size="sm"
              leftSection={
                isPending ? <Loader size={14} /> : editMode ? <IconCheck size={14} /> : <IconEdit size={14} />
              }
              variant="outline"
              disabled={isPending}
              onClick={async (e) => {
                e.preventDefault();
                if (editMode) {
                  await onSave();
                } else {
                  setEditMode((prev) => !prev);
                }
              }}
            >
              {editMode ? 'Save' : 'Edit'}
            </Button>
            <Modal.CloseButton />
          </Flex>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Flex direction="column" gap="2">
              <Title>{job?.jobTitle}</Title>
              <Flex h={40} align="center">
                <Text fw={700} w={150}>
                  company:
                </Text>
                {!editMode ? (
                  job?.company
                ) : (
                  <TextInput
                    size="sm"
                    {...register('company')}
                    placeholder="Enter company name"
                    error={errors.company?.message}
                  />
                )}
              </Flex>
              <Flex>
                <Text fw={700} w={150}>
                  posted:
                </Text>
                {job?.createdOn && formatDateToMinsk(job.createdOn)}
              </Flex>
              <Flex h={40} align="center">
                <Text fw={700} w={150}>
                  Status:
                </Text>
                {editMode ? (
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        size="sm"
                        data={
                          [
                            { value: 'ACCEPTED' as const, label: 'Accepted' },
                            { value: 'INTERVIEW' as const, label: 'Interview' },
                            { value: 'REJECTED' as const, label: 'Rejected' },
                          ] satisfies {
                            value: JobApplication['status'];
                            label: string;
                          }[]
                        }
                        placeholder="Select an option"
                        value={field.value ?? 'APPLIED'}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={errors.status?.message}
                      />
                    )}
                  />
                ) : (
                  <StatusComponent status={job?.status ?? 'APPLIED'} />
                )}
              </Flex>
              <Flex h={editMode ? 60 : 40} gap={10}>
                <Text fw={700} w={150}>
                  Salary range:
                </Text>
                {!editMode ? (
                  job?.salaryRange
                ) : (
                  <Flex gap={10}>
                    <Controller
                      name="from"
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          label="From"
                          prefix="$"
                          placeholder="Dollars"
                          min={0}
                          max={Number.MAX_SAFE_INTEGER}
                          size="md"
                          mb="md"
                          value={from}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          error={errors.from?.message}
                        />
                      )}
                    />

                    <Controller
                      name="to"
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          label="To"
                          prefix="$"
                          placeholder="Dollars"
                          min={0}
                          max={Number.MAX_SAFE_INTEGER}
                          size="md"
                          mb="md"
                          value={to}
                          onChange={(value) => field.onChange(value)}
                          error={errors.to?.message}
                        />
                      )}
                    />
                  </Flex>
                )}
              </Flex>
              <Box py={20}>
                {!editMode ? (
                  job?.description
                ) : (
                  <TextInput
                    size="sm"
                    {...register('description')}
                    placeholder="Write description"
                    error={errors.description?.message}
                  />
                )}
              </Box>
              {job?.note && (
                <Box bd="1px solid blue.6" bg="blue.1" p={10} style={{ borderRadius: '5px' }}>
                  <Text fw={700} c="blue">
                    Note
                  </Text>
                  <Text c="blue">
                    {!editMode ? (
                      job.note
                    ) : (
                      <TextInput
                        size="sm"
                        variant="unstyled"
                        c="blue"
                        {...register('note')}
                        placeholder="Write a note"
                        error={errors.note?.message}
                      />
                    )}
                  </Text>
                </Box>
              )}
            </Flex>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
