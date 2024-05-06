const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const { v4: uuidv4 } = require("uuid");
let bcrypt = require("bcryptjs");
const comparePassword = require("../models/validators/password-compare");

module.exports = (router) => {
  router.post("/register", (req, res) => {
    const { email, username, password, confirm } = req.body;
    if (!email)
      return res.json({ success: false, message: "You must provide an email" });
    if (!username)
      return res.json({
        success: false,
        message: "You must provide an username",
      });
    if (!password)
      return res.json({ success: false, message: "Provide a Password" });
    if (!confirm)
      return res.json({
        success: false,
        message: "Provide a Matching Password",
      });
    if (password !== confirm)
      return res.json({ success: false, message: "Password not match" });

    let user = new User({
      id: uuidv4(),
      email: req.body.email.toLowerCase(),
      username: req.body.username.toLowerCase(),
      password: req.body.password,
      role: "user",
    });

    user.save((err, data) => {
      if (err) {
        if (err.code === 11000) {
          res.json({
            success: false,
            message: "User name or Email already exists ",
            err: err.message,
          });
        } else {
          const errors = Object.keys(err.errors || {});
          if (errors.length) {
            const error = err.errors[errors[0]];
            res.json({
              success: false,
              message: error.message,
            });
          } else {
            res.json({
              success: false,
              message: "Could not save user Error : ",
              err,
            });
          }
        }
      } else {
        res.json({
          success: true,
          message: "Account Registered successfully",
          data: { email: data.email, username: data.username },
        });
      }
    });
    // res.send('POST in authetication')
  });

  router.get("/checkEmail/:email", (req, res) => {
    if (!req.params.email) {
      res.json({ success: false, message: "Email not provided " });
    } else {
      User.findOne({ email: req.params.email }, (err, email) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (email) {
            res.json({ success: false, message: "Email already taken" });
          } else {
            res.json({ success: true, message: "Email available" });
          }
        }
      });
    }
  });

  router.get("/checkUsername/:username", (req, res) => {
    if (!req.params.username) {
      res.json({ success: false, message: "Email not provided " });
    } else {
      User.findOne({ username: req.params.username }, (err, username) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (username) {
            res.json({ success: false, message: "Username already taken" });
          } else {
            res.json({ success: true, message: "Username available" });
          }
        }
      });
    }
  });

  //login
  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username)
      return res.json({ success: false, message: "No Username was provided" });
    if (!password)
      return res.json({ success: false, message: "No password was provided" });

    User.findOne({ username: username.toLowerCase() }, async (err, user) => {
      if (err) return res.json({ success: false, message: err.message });
      if (!user) return res.json({ success: false, message: "User Not Found" });
      if (user.status === "pending")
        return res.json({ success: false, message: "Account Still Pending" });
      if (await comparePassword(req.body.password, user.password)) {
        //remove _id andpassword from the entries
        let newUser = user.toObject();
        delete newUser.password;
        delete newUser._id;
        delete newUser.__v;

        const token = jwt.sign(newUser, config.secret, {
          expiresIn: "24h",
        });
        res.json({
          success: true,
          message: "Password is Correct",
          token: token,
        });
      } else {
        res.json({
          success: false,
          message: "Password is incorrect",
        });
      }
    });
  });

  /*
o = {a: 5, b: 6, c: 7}
Object.fromEntries(Object.entries(o).filter(e => e[0] != 'b'))
Object { a: 5, c: 7 }

*/

  // any route that needs authorization or token should be under it if not above this middleware
  router.use((req, res, next) => {
    //'@auth0/angular-jwt' automatically adds token in the headers but it also add the world 'Bearer ' so i manually format it
    //i slice the word 'Bearer '  = 7
    //let token = (req.headers['authorization']).slice(7);
    var token = "";
    if (req.headers["authorization"]) {
      token = req.headers["authorization"].substring(
        req.headers["authorization"].indexOf(" ") + 1
      );
    }

    if (!token) {
      res.json({ success: false, message: "No token provided" });
    } else {
      //decrypt token
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          //expire or invalid
          res.json({ success: false, message: "Token invalid :" + err });
        } else {
          //assign token to headers
          req.decoded = decoded;
          //to break to this functions if not it will just loop
          next();
        }
      });
    }
  });

  return router;
};
