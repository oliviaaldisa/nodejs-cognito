// authenticatedRoute
const express = require('express');
const CognitoExpress = require("cognito-express")
const authenticatedRoute = express.Router();
const app = express();
const bodyParser = require('body-parser');

const CognitoController = require('../controllers/cognitoController');

const CONFIG = require('../config/config')
const {
    ReE
} = require('../services/util.service');

// const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');


app.use(authenticatedRoute);

authenticatedRoute.use(bodyParser.urlencoded({
    extended: true
}));
authenticatedRoute.use(bodyParser.json());

//Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
    region: CONFIG.aws_poolregion,
    cognitoUserPoolId: CONFIG.awscognito_userpoolid,
    tokenUse: "id", //Possible Values: access | id
    tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

// Middleware
authenticatedRoute.use(function (req, res, next) {
    //I'm passing in the access token in header under key accessToken
    let accessTokenFromClient = req.headers.token;

    //Fail if token not present in header. 
    if (!accessTokenFromClient) {
        return ReE(res, "Token missing from header", 401);
    }

    cognitoExpress.validate(accessTokenFromClient, function (err, response) {

        //If API is not authenticated, Return 401 with error message.
        if (err) return ReE(res, err, 401);

        //Else API has been authenticated. Proceed.
        res.locals.user = response;
        next();
    });
});


authenticatedRoute.post('/logout', CognitoController.logout)
authenticatedRoute.get('/profile', CognitoController.currentUser)

module.exports = authenticatedRoute;