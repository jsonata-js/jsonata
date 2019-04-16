---
id: contributing
title: Contributing to JSONata
sidebar_label: Community and Contributing
---

## General questions

### StackOverflow

A good first start would be to ask a question here, or see previous questions [tagged with `jsonata`](https://stackoverflow.com/questions/tagged/jsonata)

### Slack

There are a community of users in the [JSONata Slack workspace](http://jsonata.slack.com) who can help with queries. You can request an invite by going to the [JSONata exerciser](http://try.jsonata.org/) and clicking the Slack icon in the top-right.

## Bugs reporting

For bugs, suspected bugs and any other odd behaviour, please [open a GitHub issue](https://github.com/jsonata-js/jsonata/issues/new). Preferably include a link to the [JSONata exerciser](http://try.jsonata.org/) which includes your source data and expression. This can be done using the "Share" function in the top-right.

## Enhancement requests

For any enhacement request, please [open a GitHub issue](https://github.com/jsonata-js/jsonata/issues/new)

## Cloning and building

To contribute changes to the JSONata code (or documentation), [fork the `jsonata` repository](https://help.github.com/en/articles/fork-a-repo), [clone the fork](https://help.github.com/en/articles/cloning-a-repository) and make your changes. You can then contribute back to the main project by opening a pull request, ensuring you have maintained code coverage.

## JSONata conformance test suite

_This section is incomplete_

The tests use the `mocha` framework and can be executed by running `npm t` or `npm run test` which also runs `eslint` linting to check the code meets the formatting requirements of the project.

## Documentation

Documentation, such as this, is all part of the `jsonata` main GitHub project. It is written in Markdown, and updates (improvements, fix, etc.) are welcome via pull requests.
