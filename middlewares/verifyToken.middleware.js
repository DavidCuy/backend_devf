const jwt = require('jsonwebtoken');
const tokens = require('../services/jwt.services');

exports.verifyToken = (req, resp, next) => {
    let headers = req.headers;
    let token = headers.authorization;
    if (token) {
        tokens.getTokenInfo(token, (err, decoded) => {
            if (err) {
                resp.status(500).json({
                    message: 'Ocurrio error en el servidor',
                    error: err
                });
            } else {
                console.log({
                    decoded: decoded
                });
                req.body.user = decoded.data;
                next();
            }
        });
    } else {
        resp.status(400).json({
            message: 'Sin token'
        });
    }
};