import { getCollection } from "astro:content";
import getPostsSorted from "@/utils/getPostsSorted";

import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

async function getPosts() {
    const posts = await getPostsSorted();
    return posts.map((item) => ({
        type: "post",
        slug: item.slug,
        title: item.data.title,
        subtitle: item.data.subtitle,
        content: sanitizeHtml(parser.render(item.body)),
    }));
}

async function getCategories() {
    const categories = await getCollection("categories");
    return categories.map((item) => ({
        type: "category",
        slug: item.slug,
        title: item.data.title,
        subtitle: item.data.subtitle,
        content: sanitizeHtml(parser.render(item.body)),
    }));
}

async function getTags() {
    const tags = await getCollection("tags");
    return tags.map((item) => ({
        type: "tag",
        slug: item.slug,
        title: item.data.title,
        subtitle: item.data.subtitle,
        content: sanitizeHtml(parser.render(item.body)),
    }));
}

export async function GET({}) {
    const [posts, categories, tags] = await Promise.all([
        getPosts(),
        getCategories(),
        getTags(),
    ]);

    const responseData = [...posts, ...categories, ...tags];

    return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
