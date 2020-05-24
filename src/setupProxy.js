const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        createProxyMiddleware(
            "/self", {
            target: 'https://api.instagram.com/v1/users/self',
            changeOrigin: true

        })
    )
    app.use(
        createProxyMiddleware(
            "/media/recent", {
            target: 'https://api.instagram.com/v1/users/self/media/recent',
            changeOrigin: true

        })
    )
}