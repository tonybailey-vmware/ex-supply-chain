const {createProxyMiddleware} = require('http-proxy-middleware');

let jsonApiUrl = process.env.REACT_APP_JSON_API_URL;

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
