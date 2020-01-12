const jwt = require('jsonwebtoken')

const check_user_access_token = (req, res, next) => {
    //Skip for login and register
  
    if (req.url == "/user/register" || req.url == "/user/login") {
      next();
      return;
    }
  
    //Get token from header
    const token = req.headers.authorization
      ? req.headers.authorization.substring(
          req.headers.authorization.indexOf(" ") + 1
        )
      : "";
  
    //Verify token
    jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
      if (error) {
        //Bad token
        console.log(error)
        res.status(401).send({
          success: false,
          request_id: Math.random()
            .toString(36)
            .substring(3),
  
          data: {},
          error: {
            message: "Unauthorized user"
          }
        });
      } else {
        //Token verified
        req.userId = decoded.id;
  
        next();
        return;
      }
    });
  };

  module.exports = check_user_access_token