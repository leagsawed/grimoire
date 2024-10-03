const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const authorization = req.headers.authorization;
  if (authorization == null) {
    res.status(401).send('Non-autorisé');
    return;
  }
  const token = authorization.split(' ')[1];
  try {
    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.userToken = tokenPayload.userId;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send('Non-autorisé');
  }
}

module.exports = { checkToken };
