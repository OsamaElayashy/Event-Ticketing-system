const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;// if not working then last option req.headers.cookie then extract token
  console.log('inside auth middleware')
  // console.log(cookie);

  if (!cookie?.token) {
    return res.status(401).json({ message: "No authentication token provided" });
  }
  const token = cookie.token;
  

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach the decoded user ID to the request object for further use
    //console.log(decoded.user)
    
    req.user = decoded.user;
    next();
  });
};

exports.isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
};
