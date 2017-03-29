module.exports = function auth(req, res, next) {
  if (!req.query.token || req.query.token !== process.env.AUTH_TOKEN) {
    return res.status(403).send('Not Authorized');
  }

  return next();
};
