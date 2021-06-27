const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /product(.*)/ , methods: ['GET','POST',"PUT","DELETE" ,'OPTIONS'] },
            {url: /category(.*)/ , methods: ['GET','POST','PUT','DELETE','OPTIONS'] },
            {url: /order(.*)/ , methods: ['GET','POST',"PUT","DELETE" ,'OPTIONS'] },
            `/users/login`,
            `/users/register`,
            `/users/`
           
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true)
    }

    done();
}

module.exports = authJwt