#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const jsonata = require('../src/jsonata');

/**
 * cli usage:
 *   jsonata <json-file> <expression>
 *   cat my-file.json | jsonata <expression>
 * @returns {{expression: string, object: {}}}
 */
function parseArgs() {
    const args = process.argv.slice(2);

    if (args.length === 2) { // file and expression given
        const [jsonFile, expression] = args;

        let object;
        try {
            object = require(path.resolve(jsonFile));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`failed to load json file ${jsonFile}`, error);
            process.exit(1);
        }

        return { object, expression };
    } else if (args.length === 1) { // expression given, read file contents from stdin
        const fileData = fs.readFileSync(0).toString();

        let object;
        try {
            object = JSON.parse(fileData);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`failed to load json string from stdin`, error);
            process.exit(2);
        }

        return { object, expression: args[0] };
    } else {
        // eslint-disable-next-line no-console
        console.error('invalid number of arguments', process.argv);
        process.exit(3);
    }
}

const { expression, object } = parseArgs();
// eslint-disable-next-line no-console
console.log(jsonata(expression).evaluate(object));
