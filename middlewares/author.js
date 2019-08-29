const jwt = require('jsonwebtoken');

const authen = (req, res, next) => {
    const token = req.headers.token;
    jwt.verify(token, 'XEDIKE', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'token invalid' });
        if (decoded) {
            req.user = decoded;
            return next();
        }
    });
};

const author = userType => {
    return (req, res, next) => {
        if (userType.findIndex(item => item === req.user.userType) !== -1)
            return next();

        res.status(403).json({ message: 'k co quyen' });
    };
};

module.exports = {
    authen,
    author
};