const assert=require('assert')
const request=require('request')
const url = "http://localhost:4000";

function getAuthToken() {
    const testUrl = url + '/login';
    return new Promise( (resolve, reject) => {
        request.post(testUrl, {
            form: {
                'username':'anystring',
                'password':'anystring'
            }
        }, (err, res) => {
            const body = JSON.parse(res.body);
            if (body.token) {
                resolve(body.token);
            }
            else {
                reject(err);
            }
        });
    });
}


describe('Node Server', () => {

    describe('getReq()', () => {
        it('should return 200', done => {
            request.get(url, (err, res) => {
                assert.equal(200, res.statusCode);
                done();
            });
        });
    });

    describe('postReq()', () => {
        it('should return 200', done => {
            request.post(url, {}, (err, res) => {
                assert.equal(200, res.statusCode);
                done();
            });
        });
    });

});


describe('Login', function() {

    describe('getJwtToken()', function() {
        it('should return a jwt token', done => {
            const testUrl = url + '/login';
            request.post(testUrl, {
                form: {
                    'username':'adithya',
                    'password':'adithya'
                }
            }, (err, res) => {
                const body = JSON.parse(res.body);
                assert.equal(200, res.statusCode);
                assert.notEqual(null, body.token);
                done();
            });
        });
    });

});




describe('Image Thumbnail', function() {

    describe('getImageThumbnail()', function() {
        it('should return a JSON Object', done => {

            const testUrl = url + '/img-thumb';

            getAuthToken() // for protected route
            .then( token => {
            	
                request.post(testUrl, {
                    headers: {
                        'token' : token
                    },
                    form: {
                        'url' : 'http://res.cloudinary.com/demo/basketball_shot.jpg'
                    }
                }, (err, res) => {
                    assert.equal(200, res.statusCode);
                    assert.equal(undefined, res.body.error);
                    done();
                });
            })
            .catch();

        }).timeout(10000);
    });

});