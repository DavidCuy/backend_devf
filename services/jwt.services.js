const jwt = require('jsonwebtoken');

exports.generateToken = (data) => {
    return jwt.sign({ data }, process.env.SECRET, { expiresIn: '1hr' });
};

exports.getTokenInfo = (token, callback) => {
    return jwt.verify(token, process.env.SECRET, (err, decoded) => {
        callback(err, decoded);
    });
};