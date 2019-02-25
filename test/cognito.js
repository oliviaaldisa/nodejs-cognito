let server = require('../app');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
let CONFIG = require('../config/config');

describe('Cognito', () => {

    describe('# Login', () => {
        it('Login into cognito success', (done) => {
            let data = {
                username: "",
                password: "",
            }

            chai.request(server)
                .post('/v1/login')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    done();
                });
        });

        it('Login into cognito fail', (done) => {
            let data = {
                username: "",
                password: "",
            }

            chai.request(server)
                .post('/v1/login')
                .send(data)
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    done();
                });
        });
    });
    
});