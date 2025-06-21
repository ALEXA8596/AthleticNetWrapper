const athleticHelper = require("./dist/index.js");
const fs = require("fs");

let JSDOM;

const getDocument =
  typeof window !== "undefined" && window.DOMParser
    ? function (text) {
        // browser
        return new DOMParser().parseFromString(text, "text/html");
      }
    : async function (text) {
        // Node.js environment
        if (!JSDOM) {
          /**
           * @type {import('jsdom')}
           */
          const jsdomModule = await import("jsdom");
          JSDOM = jsdomModule.JSDOM;
        }
        const dom = new JSDOM(text);
        return dom.window.document;
      };

async function e() {
    athleticHelper.milesplit.meets.getAllResultsData("660960");

}
e();
