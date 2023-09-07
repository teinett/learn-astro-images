// imports
import DOMPurify from "dompurify";
import Fuse from "fuse.js";

let SEARCH_DATA;
let FUSE_INSTANCE;
const FUSE_OPTIONS = {
    includeScore: true,
    shouldSort: true,
    threshold: 0.5,
    keys: [
        {
            name: "title",
            weight: 1,
        },
        {
            name: "subtitle",
            weight: 0.75,
        },
        {
            name: "content",
            weight: 0.75,
        },
    ],
};

const postResultTemplate = (title, subtitle, slug) => {
    if (subtitle === undefined) {
        return `<li class="item"><p class="title"><a class="link" href="/posts/${slug}/">🚀 ${title}</a></p></li>`;
    }

    return `<li class="item"><p class="title"><a class="link" href="/posts/${slug}/">🚀 ${title}</a></p><p class="subtitle">${subtitle}</p></li>`;
};

const categoryResultTemplate = (title, subtitle, slug) => {
    if (subtitle === undefined) {
        return `<li class="item"><p class="title"><a class="link" href="/${slug}/"><p>🌎 ${title}</a></p></li>`;
    }

    return `<li class="item"><p class="title"><a class="link" href="/${slug}/">🚀 ${title}</a></p><p class="subtitle">${subtitle}</p></li>`;
};

const tagResultTemplate = (title, subtitle, slug) => {
    if (subtitle === undefined) {
        return `<li class="item"><p class="title"><a class="link" href="/${slug}/">🌎 ${title}</a></p></li>`;
    }

    return `<li class="item"><p class="title"><a class="link" href="/${slug}/">🚀 ${title}</a></p><p class="subtitle">${subtitle}</p></li>`;
};

async function loadSpinnerSVG() {
    try {
        const response = await fetch("/icons/loader.svg");
        if (!response.ok) throw new Error(response.statusText);
        const svgContent = await response.text();
        return DOMPurify.sanitize(svgContent);
    } catch (err) {
        console.error(err);
        return "";
    }
}

// selectors
const search = document.querySelector("[data-search-input]");
const searchReadout = document.querySelector("[data-search-readout]");
const resultsList = document.querySelector("[data-search-results]");

// functions
function updateDocumentTitle(search) {
    document.title = search
        ? `Search results for “${search}”`
        : "Search the Blog";
}

function updateSearchReadout(search) {
    searchReadout.textContent = search ? `Search results for “${search}”` : "";
}

function updateSearchPageURL(search) {
    const url = new URL(window.location.href);
    url.searchParams.set("q", search);
    window.history.replaceState(null, "", url);
}

function generateSearchList(results) {
    return results
        .map((r) => {
            const { type, title, subtitle, slug } = r.item;
            if (type === "post")
                return postResultTemplate(title, subtitle, slug);
            if (type === "category")
                return categoryResultTemplate(title, subtitle, slug);
            if (type === "tag") return tagResultTemplate(title, subtitle, slug);
        })
        .join("");
}

async function fetchSearchResults(search) {
    if (search.length === 0) return;
    resultsList.innerHTML = await loadSpinnerSVG();
    if (!SEARCH_DATA) {
        try {
            const res = await fetch("/search.json");
            if (!res.ok) {
                throw new Error(error.message);
            }
            const data = await res.json();
            SEARCH_DATA = data;
        } catch (e) {
            console.error(e);
        }
    }
    if (SEARCH_DATA && !FUSE_INSTANCE) {
        FUSE_INSTANCE = new Fuse(SEARCH_DATA, FUSE_OPTIONS);
    }
    if (!FUSE_INSTANCE) return;
    const searchResult = FUSE_INSTANCE.search(search);

    resultsList.innerHTML =
        searchResult.length > 0
            ? generateSearchList(searchResult)
            : "No results found…";
}

// event listeners
window.addEventListener("DOMContentLoaded", () => {
    const urlParams = DOMPurify.sanitize(
        new URLSearchParams(window.location.search).get("q"),
    );
    fetchSearchResults(urlParams);
    updateDocumentTitle(urlParams);
    updateSearchReadout(urlParams);
    search.value = urlParams;
    search.focus();
});

search.addEventListener("input", () => {
    const searchTerm = DOMPurify.sanitize(search.value);
    updateDocumentTitle(searchTerm);
    updateSearchReadout(searchTerm);
    fetchSearchResults(searchTerm);
    updateSearchPageURL(searchTerm);
});
