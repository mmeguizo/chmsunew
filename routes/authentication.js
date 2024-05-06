const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const { v4: uuidv4 } = require("uuid");
let bcrypt = require("bcryptjs");
const comparePassword = require("../models/validators/password-compare");

module.exports = (router) => {
  router.post("/register", (req, res) => {
    if (!req.body.email) {
      res.json({ success: false, message: "You must provide an email" });
    } else {
      if (!req.body.username) {
        res.json({ success: false, message: "You must provide an username" });
      } else {
        if (!req.body.password) {
          res.json({ success: false, message: "You must provide an password" });
        } else {
          let user = new User({
            id: uuidv4(),
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password,
            role: req.body.role,
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
                if (err.errors) {
                  //for specific error email,username and password
                  if (err.errors.email) {
                    res.json({
                      success: false,
                      message: err.errors.email.message,
                    });
                  } else {
                    if (err.errors.username) {
                      res.json({
                        success: false,
                        message: err.errors.username.message,
                      });
                    } else {
                      if (err.errors.password) {
                        res.json({
                          success: false,
                          message: err.errors.password.message,
                        });
                      } else {
                        res.json({ success: false, message: err });
                      }
                    }
                  }
                } else {
                  res.json({
                    success: false,
                    message: "Could not save user Error : ",
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
        }
      }
    }
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
    if (!req.body.username) {
      res.json({ success: false, message: "No Username was provided" });
    } else {
      if (!req.body.password) {
        res.json({ success: false, message: "No password was provided" });
      } else {
        User.findOne(
          { username: req.body.username.toLowerCase() },
          async (err, user) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              if (!user) {
                res.json({ success: false, message: "User not found" });
              } else {
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
              }
            }
          }
        );
      }
    }
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
