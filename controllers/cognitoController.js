const CONFIG = require('../config/config');
const {
    ReE,
    ReS
} = require('../services/util.service');
const jwt_decode = require('jwt-decode')

//Cognito config
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

const poolData = {
    UserPoolId: CONFIG.awscognito_userpoolid,
    ClientId: CONFIG.awscognito_clientid
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
//end Cognito config

const login = async (req, res) => {
    try {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: req.body.username,
            Password: req.body.password,
        });

        var userData = {
            Username: req.body.username,
            Pool: userPool
        };

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                return ReS(res, {
                    message: "You have successfully log in.",
                    token: result.getIdToken().getJwtToken()
                })

            },

            onFailure: function (err) {
                return ReE(res, err.message, 422);
            },
        });
    } catch (e) {
        console.log(e.message)
        return TE(e.message);
    }
}

module.exports.login = login;


const logout = async (req, res) => {
    try {
        const cognitoUser = userPool.getCurrentUser()

        if (cognitoUser != null) {
            cognitoUser.signOut();
        }

        return ReS(res, {
            message: "Logout successful."
        })
    } catch (e) {
        console.log(e.message)
        return TE(e.message);
    }
}

module.exports.logout = logout;

const register = async (req, res) => {
    try {
        var attributeList = [];

        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "email",
            Value: req.body.email
        }));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "phone_number",
            Value: req.body.phone_number
        }));

        userPool.signUp(req.body.username, req.body.password, attributeList, null, function (err, result) {
            if (err) {
                return ReE(res, err.message, 422);
            }

            cognitoUser = result.user;

            return ReS(res, {
                message: "You have successfully registered",
                data: cognitoUser
            })
        });
    } catch (e) {

        return TE(e);
    }
}

module.exports.register = register;

const currentUser = async (req, res) => {
    try {
        const cognitoUser = userPool.getCurrentUser()
        if (cognitoUser != null) {

            cognitoUser.getSession(function (err, session) {

                if (err) return ReE(res, err.message, 422);

                cognitoUser.getUserAttributes(function (err, attributes) {
                    if (err) {
                        return ReE(res, err.message, 422);
                    }

                    const obj = attributes.map((val) => { return { [val.Name]: val.Value } }, {})

                    const prof = obj.reduce((result, currentObject) => {
                        for (let key in currentObject) {
                            if (currentObject.hasOwnProperty(key)) {
                                result[key] = currentObject[key];
                            }
                        }
                        return result;
                    }, {});

                    var sessionIdInfo = jwt_decode(session.getIdToken().jwtToken);

                    prof.username = cognitoUser.username
                    prof.group = sessionIdInfo['cognito:groups']

                    return ReS(res, {
                        data: prof
                    })
                });


            });
        }

    } catch (e) {
        console.log(e.message)
        return TE(e.message); // pass exception object to error handler
    }
}

module.exports.currentUser = currentUser;