const jwt = require("jsonwebtoken");

const statCheck = (req, res, next) => {
    const tokenExtracted = req.session.token;
    if (tokenExtracted) {
        jwt.verify(tokenExtracted, process.env.JWT_SECRET, (err, payload) => {
            if (!err) {
              //user is logged in
                req.user = {
                    id: payload.sub,
                    username: payload.username,
                };
            }
        });
    }
    next();
};

module.exports = statCheck;