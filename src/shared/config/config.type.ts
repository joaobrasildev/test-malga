import {
  configSchema,
  environmentSchema,
} from '@src/shared/config/config.schema';
import { z } from 'zod';

export type Environment = z.infer<typeof environmentSchema>;

export type Config = z.infer<typeof configSchema>;
