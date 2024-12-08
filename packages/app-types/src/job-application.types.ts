import { JobApplicationSchema } from 'schemas';
import { z } from 'zod';


export type JobApplication = z.infer<typeof JobApplicationSchema>;
