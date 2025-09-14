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
            .replace(/(.)/, `/* eslint-disable */\n$1`)
            .replaceAll(`../src`, `../sync`)
        
        newContent = newContent
            .split('.be.rejected')
            .map((part, i, arr) => {
                if (i === arr.length - 1) return part;
                const expectParen = 'expect('
                const indexOfExpectParen = part.lastIndexOf(expectParen);
                if (indexOfExpectParen === -1) throw new Error(`Expected expect( to appear in ${part}`);
                const upToLastExpectParen = part.slice(0, indexOfExpectParen);
                const indent = upToLastExpectParen.slice(upToLastExpectParen.trimEnd().length)

                const indexOfLastParen = part.lastIndexOf(')');
                if (indexOfLastParen === -1) throw new Error(`Expected ) to appear in ${part}`);
                
                return part.slice(0, indexOfExpectParen)
                    + `expect(
                        Promise.resolve().then(() => 
                            ${part.slice(indexOfExpectParen + expectParen.length, indexOfLastParen).trim()}
                        )
                    )`.replaceAll('                    ', indent).replaceAll('\n\n', '\n').trim()
                    + indent
                    + part.slice(indexOfLastParen + 1)
            })
            .join('.be.rejected')
            // .join('.to.eventually /* leave this "eventually" alone */.be.rejected')

        // newContent = newContent.replaceAll(`.eventually.`, `/* .eventually */ .`)
    }
    fs.mkdirSync(path.dirname(newFilepath), { recursive: true });
    fs.writeFileSync(newFilepath, newContent)
});