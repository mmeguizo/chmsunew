const User = require("../models/user"); // Import User Model Schema
const { v4: uuidv4 } = require("uuid");
const hash = require("../config/password-hasher");
const mongoose = require("mongoose");
let bcrypt = require("bcryptjs");

const ObjectId = mongoose.Types.ObjectId;

module.exports = (router) => {
  router.get("/getAllUser", (req, res) => {
    // Search database for all blog posts
    User.find(
      { deleted: false },
      { id: 1, email: 1, username: 1, department: 1, role: 1, status: 1 },
      (err, user) => {
        // Check if error was found or not
        if (err) {
          res.json({ success: false, message: err }); // Return error message
        } else {
          // Check if blogs were found in database
          if (!user) {
            res.json({ success: false, message: "No User found." }); // Return error of no blogs found
          } else {
            res.json({ success: true, user: user }); // Return success and blogs array
          }
        }
      }
    ).sort({ _id: -1 }); // Sort blogs from newest to oldest
  });

  router.post("/findById", (req, res) => {
    console.log("finding user");
    console.log(req.body);

    User.findOne({ id: req.body.id }, function (err, user) {
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!user) {
          res.json({ success: false, message: "No User found." }); // Return error of no blogs found
        } else {
          res.json({ success: true, user: user }); // Return success and blogs array
        }
      }
    });
  });

  router.post("/addUser", (req, res) => {
    const { email, username, password, confirm, department } = req.body;
    if (
      !email ||
      !username ||
      !password ||
      !department ||
      password !== confirm
    ) {
      return res.json({
        success: false,
        message:
          "You must provide an email, username, department, password and matching password",
      });
    }

    const userData = {
      id: uuidv4(),
      email: req.body.email.toLowerCase(),
      username: req.body.username.toLowerCase(),
      password: req.body.password,
      department: req.body.department,
      // role: req.body.role.toLowerCase(),
    };

    User.create(userData)
      .then((data) => {
        res.json({
          success: true,
          message: "This user is successfully Registered ",
          data: { email: data.email, username: data.username, department },
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.json({
            success: false,
            message: "User name or Email already exists ",
            err: err.message,
          });
        } else if (err.errors) {
          //for specific error email,username and password
          const errors = Object.keys(err.errors);
          res.json({ success: false, message: err.errors[errors[0]].message });
        } else {
          res.json({
            success: false,
            message: "Could not save user Error : " + err,
          });
        }
      });
  });

  router.put("/deleteUser", (req, res) => {
    let data = req.body;

    User.deleteOne(
      {
        id: data.id,
      },
      (err, user) => {
        if (err) {
          res.json({ success: false, message: "Could not Delete User" + err });
        } else {
          res.json({
            success: true,
            message: " Successfully Deleted the User",
            data: user,
          });
          // globalconnetion.emitter('user')
        }
      }
    );
  });

  router.put("/setInactiveUser", (req, res) => {
    let data = req.body;

    User.findOne(
      {
        id: data.id,
      },
      (err, user) => {
        if (err) throw err;
        User.findOneAndUpdate(
          { id: data.id },
          { deleted: true, status: "inactive" },
          { upsert: true },
          (err, response) => {
            if (err) return res.json({ success: false, message: err.message });
            if (response) {
              res.json({
                success: true,
                message: " Successfully Delete User",
                data: user,
              });
            } else {
              res.json({ success: false, message: "Could Delete User" + err });
            }
          }
        );
      }
    );
  });

  router.put("/changeUserStatus", (req, res) => {
    let data = req.body;

    User.findOne(
      {
        id: data.id,
      },
      (err, user) => {
        let statusData =
          user.status === "pending"
            ? "active"
            : user.status === "active"
            ? "inactive"
            : "active";

        if (err) throw err;
        User.findOneAndUpdate(
          { id: data.id },
          { status: statusData },
          { upsert: true },
          (err, response) => {
            if (err) return res.json({ success: false, message: err.message });
            if (response) {
              res.json({
                success: false,
                message: "Could not set User  Status" + err,
              });
            } else {
              res.json({
                success: true,
                message: " Successfully User set Status",
                data: user,
              });
            }
          }
        );
      }
    );
  });

  router.put("/updateUser", async (req, res) => {
    console.log("updateUser", req.body);
    const { username, email, department, id } = req.body;

    User.findOneAndUpdate(
      { id: id },
      { username, email, department },
      { upsert: false },
      (err, response) => {
        console.log("updateUser", response);

        if (err) return res.json({ success: false, message: err.message });
        if (response) {
          res.json({
            success: true,
            message: "User Information has been updated!",
            data: response,
          });
        } else {
          res.json({
            success: true,
            message: "No User has been modified!",
            data: response,
          });
        }
      }
    );
  });

  router.put("/updateProfile", async (req, res) => {
    let data = req.body;
    let userData = {};

    const user = await User.findOne({ id: req.body.id });

    if (data.new_password) {
      let checkPassword = await bcrypt.compare(
        data.current_password,
        user.password
      );
      if (!checkPassword) {
        res.json({
          success: false,
          message:
            "Incorrect Old Password : " +
            data.current_password +
            " for " +
            data.username,
        });
      } else {
        hash
          .encryptPassword(data.new_password)
          .then((hash) => {
            userData.role = data.role;
            userData.username = data.username;
            userData.email = data.email;
            userData.password = hash;
            userData.profile_pic = data.profile_pic;
            User.findOneAndUpdate(
              { id: data.id },
              userData,
              { upsert: true },
              (err, response) => {
                if (err)
                  return res.json({ success: false, message: err.message });
                if (response) {
                  res.json({
                    success: true,
                    message: "User Information has been updated!",
                    data: response,
                  });
                } else {
                  res.json({
                    success: true,
                    message: "No User has been modified!",
                    data: response,
                  });
                }
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      const { username, email, profile_pic, id } = req.body;

      console.log("updateProfile", req.body);

      User.findOneAndUpdate(
        { id: id },
        { username, email, profile_pic },
        { upsert: false },
        (err, response) => {
          if (err) return res.json({ success: false, message: err.message });
          if (response) {
            res.json({
              success: true,
              message: "User Information has been updated!",
              data: response,
            });
          } else {
            res.json({
              success: true,
              message: "No User has been modified!",
              data: response,
            });
          }
        }
      );
    }
  });

  router.get("/profile/:id", (req, res) => {
    User.findOne({ id: req.params.id })
      .select("username email profile_pic")
      .exec((err, user) => {
        if (err) {
          res.json({ success: false, message: err.message });
        } else {
          if (!user) {
            res.json({ success: false, message: "User not found" });
          } else {
            res.json({ success: true, user: user });
          }
        }
      });
  });

  router.get("/UserProfilePic/:id", (req, res) => {
    User.findOne({ profile_pic: req.params.id })
      .select("profile_pic")
      .exec((err, user) => {
        if (err) {
          res.json({ success: false, message: err.message });
        } else {
          if (!user) {
            res.json({ success: false, message: "UserPic not found" });
          } else {
            res.json({ success: true, picture: user });
          }
        }
      });
  });

  return router;
};
