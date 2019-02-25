require('dotenv').config({path:__dirname+'/../.env'}); //instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || '';
CONFIG.port         = process.env.PORT  || '';

CONFIG.awscognito_userpoolid    = process.env.AWSCOGNITO_USERPOOLID || '';
CONFIG.awscognito_clientid      = process.env.AWSCOGNITO_CLIENTID   || '';
CONFIG.aws_poolregion           = process.env.AWS_POOLREGION || '';

CONFIG.unittest_token = process.env.UNITTEST_TOKEN || '';

module.exports = CONFIG;