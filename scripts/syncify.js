/* eslint-disable */
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../src");
const srcFiles = fs.readdirSync(srcDir).map(file => path.join(srcDir, file));

const syncDir = path.join(__dirname, "../sync");
fs.mkdirSync(syncDir, { recursive: true });


srcFiles.forEach(file => {
    const content = fs.readFileSync(file, "utf8");
    const newContent = content
        .replace(/(.)/, `/* eslint-disable */\n$1`)
        .replace(/\basync\b/g, "/* async */")
        .replace(/\/\* async \*\/( ?):/g, "async$1:") // whoops
        .replace(/\bawait\b/g, "/* await */")
        .replace(/\bPromise.all\b/g, "Array.from")
        .replace(/(\s*)(\bif \(isPromise\(.*?\)\))/g, `\n$1$2 throw new Error(${JSON.stringify(`Expression "$2" evaluated to a promise`.replace('isPromise', ''))});\n$1$2`)
        ;
    fs.writeFileSync(path.join(syncDir, path.basename(file)), newContent);
});

const testDir = path.join(__dirname, "../test");

const syncTestDir = path.join(__dirname, "../sync-test");
fs.mkdirSync(syncTestDir, { recursive: true });
const testFiles = fs.globSync('test/**/*.*')

testFiles.forEach(file => {
    if (file.includes('async-function.js')) return;
    if (fs.statSync(file).isDirectory()) return;
    const newFilepath = file.replace('test/', 'sync-test/')
    const content = fs.readFileSync(file, "utf8");
    let newContent = content
    if (file.endsWith('.js')) {
        newContent = newContent
        // .replace(/(.)/, `/* eslint-disable */\n$1`)
        .replaceAll(`../src`, `../sync`)
        .replaceAll(`.eventually.`, `/* .eventually */ .`)
    }
    console.log(newFilepath);
    console.log(newContent.slice(0, 100));
    fs.mkdirSync(path.dirname(newFilepath), { recursive: true });
    fs.writeFileSync(newFilepath, newContent)
});