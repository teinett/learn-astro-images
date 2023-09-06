import { defineCollection, reference, z } from "astro:content";

const blogCollection = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
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
            cover: image().optional(),
        }),
});

const categoryCollection = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            cover: image().optional(),
        }),
});

// Name of collection = name of the folder with md files. Example: src/content/blog
export const collections = {
    posts: blogCollection,
    tags: tagCollection,
    categories: categoryCollection,
};
