import DOMPurify from "dompurify";

const search = document.querySelector("[data-search-input]");
const searchReadout = document.querySelector("[data-search-readout]");

function updateDocumentTitle(search) {
    document.title = search ? `Search results for "${search}"` : "Search";
}

function updateSearchReadout(search) {
    searchReadout.textContent = search ? `Showing results for "${search}"` : "";
}

// event listener
window.addEventListener("DOMContentLoaded", () => {
    const URLparams = DOMPurify.sanitize(
        new URLSearchParams(window.location.search).get("q")
    );
    updateDocumentTitle(URLparams);
    updateSearchReadout(URLparams);
    search.value = URLparams;
    search.focus();
});

search.addEventListener("input", () => {
    const searchTerm = DOMPurify.sanitize(search.value.trim());
    updateDocumentTitle(searchTerm);
    updateSearchReadout(searchTerm);
});
