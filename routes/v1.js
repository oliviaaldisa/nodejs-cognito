const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const CognitoController = require('../controllers/cognitoController');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

router.post('/login', CognitoController.login)
router.post('/register', CognitoController.register)

module.exports = router;