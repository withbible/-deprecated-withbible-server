const authenticate = (req, res, next) => {
  if (!req.session || !req.session.user)
    next(new Error('권한이 없습니다.'));
    
  next();
}

module.exports = authenticate;