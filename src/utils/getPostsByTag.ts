import type { CollectionEntry } from "astro:content";

function getPostsByTag(posts: CollectionEntry<"posts">[], tag: string) {
    const filteredPosts = posts.filter((post) => {
        const postTags = post.data?.tags?.map((tag) => tag.slug);

        return postTags?.includes(tag);
    });

    return filteredPosts;
}

export default getPostsByTag;
