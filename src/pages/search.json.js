import { getCollection } from "astro:content";
import getPostsSorted from "@/utils/getPostsSorted";

async function getPosts() {
    const posts = (await getCollection("posts"))
        .sort(
            // featured posts first
            (a, b) =>
                a.data.featured === b.data.featured
                    ? 0
                    : a.data.featured
                    ? -1
                    : 1,
        )
        .sort(
            // sort by date of updatedAt (if available) or publishedAt, recent first
            (a, b) =>
                a.data.updatedAt && b.data.updatedAt
                    ? new Date(a.data.updatedAt.valueOf()) -
                      new Date(b.data.updatedAt.valueOf())
                    : new Date(a.data.publishedAt.valueOf()) -
                      new Date(b.data.publishedAt.valueOf()),
        );
    return posts.map((post) => ({
        slug: post.slug,
        title: post.data.title,
    }));
}

export async function get({}) {
    return new Response(JSON.stringify(await getPosts()), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
