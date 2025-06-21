/**
 * @type {globalThis.fetch | import('undici').fetch}
 */
let fetch;

if (typeof window === "undefined") {
    // Node.js environment
    ({ fetch } = await import("undici"));
} else {
    // Browser environment
    fetch = window.fetch.bind(window);
}

export default fetch