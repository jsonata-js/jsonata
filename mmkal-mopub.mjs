// run with `npx mopub --config mmkal-mopub.mjs`
export default {
  async transformPackage({helpers}) {
    await helpers.editJsonFile('package.json', packageJson => {
      packageJson.name = '@mmkal/jsonata'
      packageJson.description = 'JSON query and transformation language. Can run synchronously or asynchronously.'
    })

    await helpers.editFile('README.md', readme => {
      const dedent = (s) => s.replaceAll('\n           ', '\n').trim()
      const [beginning, header1, middle, header2, end] = readme.split(/(## Installation|## More information)/).map(s => s.trim())
      return [
        beginning,
        header1,
        dedent(`
            - \`npm install @mmkal/jsonata\`

            ## Quick start

            Presumably you are using \`@mmkal/jsonata\` rather than the upstream [jsonata](https://npmjs.com/package/jsonata) because you want the synchronous API. Here's how you use it:

            In Node.js:

            \`\`\`javascript
            const jsonata = require('@mmkal/jsonata/sync');

            const data = {
                example: [
                    {value: 4},
                    {value: 7},
                    {value: 13}
                ]
            };

            const expression = jsonata('$sum(example.value)');
            const result = expression.evaluate(data);  // returns 24
            \`\`\`

            Background: this package comes from [jsonata-js/jsonata#758](https://github.com/jsonata-js/jsonata/pull/758), which was opened after discussion in [jsonata-js/jsonata#733](https://github.com/jsonata-js/jsonata/issues/733).
        `),
        header2,
        end
      ].join('\n\n')
    })
  },
}
