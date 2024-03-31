import jwtDecode from "jwt-decode";

export default function authMiddleware(req, res, next) {
  next();
  // const token = req.session.token;
  // if (!token) {
  //   return res.status(401).send("Unauthorized");
  // }
  // try {
  //   const user = jwtDecode(token);
  //   req.user = user;
  //   next();
  // } catch (error) {
  //   res.status(400).send("Invalid token.");
  // }
}
