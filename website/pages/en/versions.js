/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');

const Container = CompLibrary.Container;

const CWD = process.cwd();

const versions = require(`${CWD}/versions.json`);

function Versions(props) {
    const {config: siteConfig} = props;
    const latestVersion = versions[0];
    const releases = 'https://github.com/jsonata-js/jsonata/releases';
    return (
        <div className="docMainWrapper wrapper">
            <Container className="mainContainer versionsContainer">
                <div className="post">
                    <header className="postHeader">
                        <h1>{siteConfig.title} Versions</h1>
                    </header>
                    <p>New versions of this project are released every so often.</p>
                    <h3 id="latest">Current version (Stable)</h3>
                    <table className="versions">
                        <tbody>
                        <tr>
                            <th>{latestVersion}</th>
                            <td>
                                <a href="overview">Documentation</a>
                            </td>
                            <td>
                                <a href={releases + '/latest'}>Release Notes</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <p>
                        This is the current version of JSONata when installed from NPM
                    </p>
                    <h3 id="rc">Pre-release versions</h3>
                    <table className="versions">
                        <tbody>
                        <tr>
                            <th>master</th>
                            <td>
                                <a href="next/overview">Documentation</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <p>This is the latest development version of JSONata as committed to 'master' branch.  This version may be unstable.</p>
                    <h3 id="archive">Past Versions</h3>
                    <table className="versions">
                        <tbody>
                        {versions.map(
                            version =>
                                version !== latestVersion && (
                                    <tr>
                                        <th>{version}</th>
                                        <td>
                                            <a href={version + '/overview'}>Documentation</a>
                                        </td>
                                        <td>
                                            <a href={releases + '/tag/v' + version}>Release Notes</a>
                                        </td>
                                    </tr>
                                ),
                        )}
                        </tbody>
                    </table>
                </div>
            </Container>
        </div>
    );
}

module.exports = Versions;

