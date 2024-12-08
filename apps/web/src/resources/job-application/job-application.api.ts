import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { apiService } from 'services';

import queryClient from 'query-client';

import { JobApplicationUpdates } from 'schemas';
import { ApiError, JobApplication, ListParams, ListResult, SortOrder } from 'types';

export type JobApplicationsListSortParams = {
  createdOn?: SortOrder;
  firstName?: SortOrder;
  lastName?: SortOrder;
};

export type JobApplicationsListParams = ListParams<Record<string, unknown>, JobApplicationsListSortParams>;

export const useGet = (key: string, options: Partial<UseQueryOptions<JobApplication>> = {}) =>
  useQuery<JobApplication>({
    queryKey: ['job-applications', key],
    queryFn: () => apiService.get(`/job-applications/${key}`),
    staleTime: 5 * 1000,
    ...options,
  });

export const useList = <T extends JobApplicationsListParams>(params: T) =>
  useQuery<ListResult<JobApplication>>({
    queryKey: ['job-applications', params],
    queryFn: () => apiService.get('/job-applications/list', params),
  });

export const useCreate = <T = Omit<JobApplication, '_id'>>() =>
  useMutation<JobApplication, ApiError, T>({
    mutationFn: (data: T) => apiService.post('/job-applications/create', data),
    // onMutate: async (newJob) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({ queryKey: ['job-applications'] });

    //   // Snapshot the previous value
    //   const previousJobs = queryClient.getQueryData(['job-applications', (newJob as JobApplication)._id]);

    //   // Optimistically update to the new value
    //   queryClient.setQueryData(['job-applications'], (old: any) => [...old, newJob]);

    //   // Return a context object with the snapshotted value
    //   return { previousJobs };
    // },
    onSuccess: (data) => {
      queryClient.setQueryData(['job-applications', data._id], data);
      queryClient.invalidateQueries({ queryKey: ['job-applications', data._id] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
  });

export const useUpdate = <T = { _id: string; updates: JobApplicationUpdates }>() =>
  useMutation<JobApplication, ApiError, T>({
    mutationFn: (data: T) => apiService.post(`/job-applications/update`, data),

    // onMutate: async (newJob) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({ queryKey: ['job-applications', (newJob as JobApplication)._id] });

    //   // Snapshot the previous value
    //   const previousTodo = queryClient.getQueryData(['job-applications', (newJob as JobApplication)._id]);

    //   // Optimistically update to the new value
    //   queryClient.setQueryData(['todos', (newJob as JobApplication)._id], newJob);

    //   // Return a context with the previous and new todo
    //   return { previousTodo, newJob };
    // },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['job-applications', data._id] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
  });

export const useDelete = <T = { _id: string | string[] }>() =>
  useMutation<JobApplication, ApiError, T>({
    mutationFn: (data) => apiService.post('/job-applications/delete', data),
    onSuccess: (data) => {
      queryClient.setQueryData(['job-applications', data._id], null);
      queryClient.invalidateQueries({ queryKey: ['job-applications', data._id] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
    },
  });
