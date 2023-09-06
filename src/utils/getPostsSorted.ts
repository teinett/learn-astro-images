import { getCollection } from "astro:content";

async function getPostsSorted() {
    const allPosts = await getCollection("posts", (post) => {
        // Filter out posts with a future date publishedAt
        return post.data.publishedAt <= new Date();
    });

    // If post has date updatedAt, check if it's newer than publishedAt.
    // If not, set updatedAt to publishedAt
    allPosts.forEach((post) => {
        if (post.data.updatedAt) {
            if (post.data.updatedAt < post.data.publishedAt) {
                post.data.updatedAt = post.data.publishedAt;
            }
        }
    });

    // Create new array with posts that have a featured flag
    const featuredPosts = allPosts.filter((post) => post.data.featured);

    // Sort featured posts by date: if post has date updatedAt, use that, otherwise use publishedAt
    // Newest post first
    const featuredPostsSorted = featuredPosts.sort((a, b) => {
        const aDate = a.data.updatedAt ? a.data.updatedAt : a.data.publishedAt;
        const bDate = b.data.updatedAt ? b.data.updatedAt : b.data.publishedAt;
        return bDate.valueOf() - aDate.valueOf();
    });

    // Create new array with posts that don't have a featured flag
    const nonFeaturedPosts = allPosts.filter((post) => !post.data.featured);

    // Sort nonFeaturedPosts posts by date: if post has date updatedAt, use that, otherwise use publishedAt
    // Newest post first
    const nonFeaturedPostsSorted = nonFeaturedPosts.sort((a, b) => {
        const aDate = a.data.updatedAt ? a.data.updatedAt : a.data.publishedAt;
        const bDate = b.data.updatedAt ? b.data.updatedAt : b.data.publishedAt;
        return bDate.valueOf() - aDate.valueOf();
    });

    // Combine featured and non-featured posts into one array. Featured posts first.
    const postsSorted = featuredPostsSorted.concat(nonFeaturedPostsSorted);

    return postsSorted;
}

export default getPostsSorted;
