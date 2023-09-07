import { defineCollection, reference, z } from "astro:content";

const postsCollection = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            tags: z.array(reference("tags")).optional(),
            category: reference("categories"),
            publishedAt: z.date().transform((str) => new Date(str)),
            updatedAt: z
                .date()
                .transform((str) => new Date(str))
                .optional(),
            cover: image().optional(),
            gallery: z.array(image()).optional(),
            featured: z.boolean().optional(),
        }),
});

const tagCollection = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            cover: image().optional(),
        }),
});

const categoryCollection = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            cover: image().optional(),
        }),
});

// Name of collection = name of the folder with md files. Example: src/content/blog
export const collections = {
    posts: postsCollection,
    tags: tagCollection,
    categories: categoryCollection,
};
