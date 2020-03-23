const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  env: {
    // !PROD ENVS - TODO - UPDATE EMPTY ENS
    // * FB stuff + Auth0 + CORS stuff + HTTPS server for FB testing
    // SERVER_URL:
    //   'https://welqbatkyb.execute-api.ap-southeast-2.amazonaws.com/prod/nmm-app',
    // FB_GROUP_ID: '548965739271455',
    // FB_APP_ID: '695528800971318',
    // APP_DOMAIN: 'nomeatmay.au.auth0.com',
    // APP_CLIENT_ID: '4i4QDNDVF5rKsxsaRdMf6EmQvuQx0Gx4',
    // AUDIENCE: 'https://nomeatmay.au.auth0.com/api/v2/',
    // CLIENT_URL: 'https://nomeatmay.recipes',
    // REDIRECT_URL: 'https://nomeatmay.recipes',
    // LOGGER_URI: 'https://88xfp20uuk.execute-api.ap-southeast-2.amazonaws.com',
    // ! LOCAL & PROD ENVS
    // Don't worry about Ryan creating another account
    CLOUDINARY_API: 'https://api.cloudinary.com/v1_1/codeinaire/image/upload',
    // * NOTE change to false in PROD
    IS_DEVELOPMENT: true,
    // !LOCAL ENVS development
    // * FB stuff + Auth0 + CORS stuff + HTTPS server for FB testing
    REDIRECT_URL: 'http://localhost:3000/',
    CLIENT_URL: 'http://localhost:3000',
    SERVER_URL: 'http://localhost:4000/nmm-app',
    FB_GROUP_ID: '469380029875741',
    FB_APP_ID: '695528800971318',
    // Auth0 + CORS stuff
    APP_DOMAIN: 'dev-s70wdmyk.au.auth0.com',
    APP_CLIENT_ID: 'Mn51EwPsHWiZUVRZJyNkNRZGKMikJoSE',
    AUDIENCE: 'https://dev-s70wdmyk.au.auth0.com/api/v2/'
    // HTTPS: true,
    // CLIENT_URL: 'https://myapp.example:3000/',
    // SERVER_URL: 'https://localhost:4000/nmm-app',
    // REDIRECT_URL: 'https://myapp.example:3000/'
  },
  webpack: config => {
    // https://github.com/justadudewhohacks/face-api.js/issues/154
    config.node = { fs: 'empty', fetch: 'empty' }
    return config
  },
  target: 'serverless'
})
