import React from 'react';
import { Button, Flex, NumberInput, Text, Textarea, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { jobApplicationApi } from 'resources/job-application';

import { handleApiError } from 'utils';
import { createRangeString } from 'utils/format';

import { JobApplicationSchema } from 'schemas';
import type { JobApplication } from 'types';

type Schema = Omit<JobApplication, '_id' | 'salaryRange'> & {
  from: number;
  to: number;
};
export const CreateJobApplication = ({ close }: { close: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<Schema>({
    defaultValues: {
      from: 0,
      to: 100000,
    },
    resolver: zodResolver(
      JobApplicationSchema.omit({
        _id: true,
        salaryRange: true,
      }).extend({
        from: z.number(),
        to: z.number(),
      }),
    ),
  });
  const { mutate: create, isPending } = jobApplicationApi.useCreate();

  const onSubmit = (data: Schema) => {
    const salaryRange = createRangeString(data.from, data.to);

    create(
      {
        company: data.company,
        description: data.description,
        jobTitle: data.jobTitle,
        salaryRange,
        status: data.status,
        ...(data.note && { note: data.note }),
      },
      {
        onError: (e) => {
          handleApiError(e, setError);
        },
        onSuccess() {
          showNotification({
            title: 'Success',
            message: `Job application has been created!`,
            color: 'green',
          });
          close();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap={10} px={4} pb={10}>
        <TextInput
          {...register('jobTitle')}
          label="Job title"
          placeholder="Enter job title"
          error={errors.jobTitle?.message}
        />
        <TextInput
          {...register('company')}
          label="Company"
          placeholder="Enter company name"
          error={errors.company?.message}
        />
        <Textarea
          {...register('description')}
          label="Description"
          size="md"
          placeholder="Write description"
          error={errors.description?.message}
        />
        <Text>Salary range</Text>
        <Flex gap={10}>
          <Controller
            name="from"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <NumberInput
                label="From"
                prefix="$"
                placeholder="Dollars"
                min={0}
                max={Number.MAX_SAFE_INTEGER}
                size="md"
                mb="md"
                value={field.value}
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
            defaultValue={100000}
            render={({ field }) => (
              <NumberInput
                label="To"
                prefix="$"
                placeholder="Dollars"
                min={0}
                max={Number.MAX_SAFE_INTEGER}
                size="md"
                mb="md"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                error={errors.to?.message}
              />
            )}
          />
        </Flex>
        <Textarea
          size="md"
          {...register('note')}
          label="Note (optional)"
          placeholder="Write note"
          error={errors.description?.message}
        />
        <Button type="submit" loading={isPending} disabled={isPending}>
          Publish
        </Button>
      </Flex>
    </form>
  );
};
