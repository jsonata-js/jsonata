/**
 * © Copyright IBM Corp. 2016, 2017 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

export default [
    // This will convert the ES2015 modules (but not other ES2015 features) to CommonJS modules
    {
        input: "es2015/jsonata.js",
        output: {
            format: "cjs",
            file: "dist/jsonata-cjs.js",
        },
    },
    // This will convert the ES2015 modules (but not other ES2015 features) to a Universal Module Definition
    {
        input: "es2015/jsonata.js",
        output: {
            format: "iife",
            file: "dist/jsonata-browser.js",
            name: "jsonata",
        },
    },
];
