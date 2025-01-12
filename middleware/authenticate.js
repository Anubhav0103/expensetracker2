module.exports = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).send('Unauthorized: No user ID provided');
    }
    req.userId = userId;
    next();
  };
  