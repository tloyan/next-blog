import z from "zod";

export const articleSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  excerpt: z.string(),
  tagsId: z.array(z.string()),
  image: z.string(),
  content: z.string(),
});

export const createArticleSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  excerpt: z.string(),
  tagsId: z.array(z.string()),
  image: z.string().optional(),
});

export const publishArticleSchema = z.object({
  id: z.number(),
  published: z.boolean(),
});

export const updateArticleContentSchema = articleSchema
  .pick({
    id: true,
    content: true,
  })
  .required();
