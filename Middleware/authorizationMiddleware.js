module.exports= function authorizationMiddleware(roles) {
    return (req, res, next) => {
      console.log('User:',req.user)
      const userRole = req.user.role;
      if (!roles || !userRole ||!roles.includes(userRole))
        return res.status(403).json("unauthorized access");
      // console.log('authormid')
      next();
    };
  }
