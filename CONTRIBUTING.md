# Contributing to JSONata

We welcome contributions, but request you follow these guidelines.

 - [Raising issues](#raising-issues)
 - [Feature requests](#feature-requests)
 - [Pull-Requests](#pull-requests)

This project adheres to the [Contributor Covenant 1.4](http://contributor-covenant.org/version/1/4/). By participating, you are expected to uphold this code. Please report unacceptable behavior to any of the [project's core team](https://github.com/orgs/jsonata-js/teams/core).

## Raising issues

Please raise any bug reports on the relevant project's issue tracker. Be sure to search the list to see if your issue has already been raised.

A good bug report is one that make it easy for us to understand what you were trying to do and what went wrong.

Provide as much context as possible so we can try to recreate the issue.

At a minimum, please include:

 - Version of `jsonata` - either release number if you downloaded a zip, or the first few lines of `git log` if you are cloning the repository directly.
 - Version of Node.js (`node -v`), or browser vendor and version.


## Feature requests

tba

## Pull requests

tba

### Legal stuff

We have tried to make it as easy as possible to make contributions. This applies to how we handle the legal aspects of contribution. We use the same approach&mdash;the [Developer's Certificate of Origin 1.1 (DCO)](DCO1.1.txt)&mdash;that the Linux&reg; Kernel [community](http://elinux.org/Developer_Certificate_Of_Origin) uses to manage code contributions. We simply ask that when submitting a pull request, the developer must include a sign-off statement in the pull request description.

Here is an example Signed-off-by line, which indicates that the submitter accepts the DCO:

```
Signed-off-by: John Doe <john.doe@hisdomain.com>
```

### Coding standards

Please ensure you follow the coding standards used through-out the existing code base. Coding standards are checked by ESLint. 100% test coverage must be maintained at all times.

## Running tests

Tests are written using Mocha and can be run directly via NPM.

```
npm test
```

> *Timezones* There are a number of tests that test date functionality. In order for these tests to pass they need to be run in GMT time. (Since Jan 1 in GMT is still Dec 31 in any timezone further west). The workaround is to update your system clock to be in GMT while you are running tests.
