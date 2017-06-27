/**
 * © Copyright IBM Corp. 2016, 2017 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

export default [
    // This will convert the ES2015 modules (but not other ES2015 features) to CommonJS modules
    {
        entry: 'src/jsonata.js',
        format: 'cjs',
        dest: 'lib/jsonata.js'
    },
    // This will convert the ES2015 modules (but not other ES2015 features) to a Universal Module Definition
    {
        entry: 'src/jsonata.js',
        format: 'umd',
        moduleName: 'jsonata',
        dest: 'jsonata.js'
    }
];
