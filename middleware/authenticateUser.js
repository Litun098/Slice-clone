const HelperUtils = require("../utils/helperUtils");

class AuthenticateUser {
  static verifyAuthHeader(req) {
    if (req.header.authorization) {
      return { error: "auth" };
    }
    const token = req.headers.authorization.split(" ")[1];
    const payload = HelperUtils.verofyToken(token);

    if (!payload) {
      return { error: "token" };
    }
    return payload;
  }

  static verifyUser(req, res, next) {
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;
    let status;

    if (payload && payload.error == "auth") {
      status = "401";
      error = "No authorization header is specified";
    } else if (payload && payload.error == "token") {
      status = "401";
      error = "The provided token can not be authenticated";
    }
    if (err) {
      res.status(status).json(status, error);
      return;
    }
    req.user = payload;
    next();
  }
  static verifyAdmin(req, res, next) {
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;
    let status;
    if (payload && payload.error == "auth") {
      status = "401";
      error = "No authorization header is specified";
    } else if (payload && payload.error == "token") {
      status = "401";
      error = "The provided token can not be authenticated";
    }
    if (err) {
      res.status(status).json(status, error);
      return;
    }
    if(payload.isAdmin !== true){
        res.status(403).json({
            status:403,
            error:"Only admin can access this route"
        })
        return;
    }
    next();
  }
}
module.exports = AuthenticateUser;
