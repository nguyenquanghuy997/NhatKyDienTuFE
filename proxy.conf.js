// const { env } = require('process');

// const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:44379` :
//   env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:21245';

// const target = `https://localhost:44379`;

// const PROXY_CONFIG = [
//   {
//     context: [
//       "/api/**",
//    ],
//     target: target,
//     secure: false,
//     headers: {
//       Connection: 'Keep-Alive'
//     }
//   }
// ]

// module.exports = PROXY_CONFIG;
