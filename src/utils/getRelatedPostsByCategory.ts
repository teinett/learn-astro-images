import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

async function getRealatedPostsByCategory(post: CollectionEntry<"posts">) {
    // Get post category
    const postCategory = post.data.category;

    // Get all posts
    const allPosts = await getCollection("posts");

    // If no category, return empty array
    if (!postCategory) return [];

    // Filter posts by category, excluding current post
    const relatedPosts = allPosts.filter((item) => {
        return item.data.category === postCategory && item.slug !== post.slug;
    });

    return relatedPosts;
}

export default getRealatedPostsByCategory;
