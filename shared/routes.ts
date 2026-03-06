import { z } from 'zod';
import { inmateSchema, processResponseSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  inmates: {
    scrape: {
      method: 'GET' as const,
      path: '/api/scrape' as const,
      responses: {
        200: z.object({ success: z.boolean(), count: z.number() }),
        500: errorSchemas.internal,
      }
    },
    list: {
      method: 'GET' as const,
      path: '/api/inmates' as const,
      responses: {
        200: z.array(inmateSchema),
      }
    }
  },
  pdf: {
    upload: {
      method: 'POST' as const,
      path: '/api/upload' as const,
      // upload uses FormData so input isn't strictly typed here for Zod
      responses: {
        200: processResponseSchema,
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
