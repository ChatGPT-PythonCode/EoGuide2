import { z } from 'zod';
import { insertGuideSchema, guides } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  guides: {
    list: {
      method: 'GET' as const,
      path: '/api/guides',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof guides.$inferSelect>()),
      },
    },
    getBySlug: {
      method: 'GET' as const,
      path: '/api/guides/slug/:slug',
      responses: {
        200: z.custom<typeof guides.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/guides/:id',
      responses: {
        200: z.custom<typeof guides.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    // Keep create/update/delete for future admin use or seeding
    create: {
      method: 'POST' as const,
      path: '/api/guides',
      input: insertGuideSchema,
      responses: {
        201: z.custom<typeof guides.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
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
