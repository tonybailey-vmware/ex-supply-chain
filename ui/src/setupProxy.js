/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const http = require('http');

const {createProxyMiddleware} = require('http-proxy-middleware');

const jsonApiUrl = process.env.REACT_APP_JSON_API_URL;

console.log(`JSON API proxy: ${jsonApiUrl}`);

module.exports = function (app) {
    app.use(
        '/v1',
        createProxyMiddleware({
            target: jsonApiUrl,
            changeOrigin: true,
            ws: true
        })
    );
};

// Need to send a dummy HTTP request to a proxied URL to initialize the proxy middleware.
// See: https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
function initializeProxy() {
    try {
        http.request(`${process.env.REACT_APP_HTTP_BASE_URL}/v1/query`).end();
    } catch (e) {
        // Safe to ignore.
    }
}

initializeProxy();
