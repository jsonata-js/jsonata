/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'JSONata', // Title for your website.
  tagline: 'JSON query and transformation language',
  url: 'http://docs.jsonata.org', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  docsUrl: '',

  // Used for publishing and more
  projectName: 'jsonata-js.github.io',
  organizationName: 'jsonata-js',
    // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  cname: 'docs.jsonata.org', // adds the CNAME file to the generated docs repo

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'overview', label: 'Docs'},
    { href: "http://try.jsonata.org", label: "Try" },
    { href: "https://github.com/jsonata-js/jsonata", label: "GitHub" },
    { href: "https://www.npmjs.com/package/jsonata", label: "NPM" },
  ],

  /* path to images for header/footer */
  headerIcon: 'img/jsonata-button.png',
  footerIcon: 'img/jsonata-white-167.png',
  favicon: 'img/jsonata-button.png',

  /* Colors for website */
  colors: {
    primaryColor: '#275154',
    secondaryColor: '#275154',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © 2021 JSONata.org`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    '/js/jsonata-examples.js'
  ],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  //ogImage: 'img/docusaurus.png',
  //twitterImage: 'img/docusaurus.png',

  editUrl: 'https://github.com/jsonata-js/jsonata/edit/master/docs/'

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
