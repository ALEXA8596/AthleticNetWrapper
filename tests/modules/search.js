const search = require('../../dist/modules/search').default;
const fs = require("fs");

(async () => {
    // Autocomplete
    fs.writeFileSync(
        "tests/outputs/search/autocomplete.json",
        JSON.stringify(await search.AutoComplete("Arcadia"))
    );


    // runSearch
    fs.writeFileSync(
        "tests/outputs/search/runSearch.json",
        JSON.stringify(await search.runSearch("Arcadia"))
    );
})();