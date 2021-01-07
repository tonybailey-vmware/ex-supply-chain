/*
 * Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
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
