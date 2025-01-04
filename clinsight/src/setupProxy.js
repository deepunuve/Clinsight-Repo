// // src/setupProxy.js
// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   // Proxy for the first API (port 9003)
//   app.use(
//     '/api1', // Any URL starting with /api1 will be proxied to port 9004
//     createProxyMiddleware({
//       target: 'http://184.105.215.253:9003',
//       changeOrigin: true,
//       pathRewrite: {
//         '^/api1': '', // Remove "/api1" prefix before sending the request
//       },
//     })
//   );

//   // Proxy for the second API (port 9004)
//   app.use(
//     '/api2', // Any URL starting with /api2 will be proxied to port 9003
//     createProxyMiddleware({
//       target: 'http://184.105.215.253:9004',
//       changeOrigin: true,
//       pathRewrite: {
//         '^/api2': '', // Remove "/api2" prefix before sending the request
//       },
//     })
//   );
// };
