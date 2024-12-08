import { z } from 'zod';

import dbSchema from './db.schema';

export const JobApplicationSchema = dbSchema
  .extend({
    company: z.string().min(1),
    jobTitle: z.string().min(1),
    description: z.string().min(1),
    salaryRange: z.string(),
    status: z.enum(['APPLIED', 'INTERVIEW', 'REJECTED', 'ACCEPTED']).optional().default('APPLIED'),
    note: z.string().optional(),
  })
  .strip();

export const JobApplicationUpdatesSchema = JobApplicationSchema.pick({
  company: true,
  jobTitle: true,
  note: true,
  status: true,
  salaryRange: true,
  description: true,
}).partial();
export type JobApplicationUpdates = z.infer<typeof JobApplicationUpdatesSchema>;
