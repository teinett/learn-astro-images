import type { CollectionEntry } from "astro:content";

function getPostsByCategory(
    posts: CollectionEntry<"posts">[],
    category: string
) {
    const filteredPosts = posts.filter((post) => {
        return post.data.category.slug === category;
    });

    return filteredPosts;
}

export default getPostsByCategory;
