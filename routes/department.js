const Department = require("../models/department"); // Import Department Model Schema
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

module.exports = (router) => {
  router.get("/getAllDepartment", (req, res) => {
    // Search database for all blog posts
    Department.find(
      { deleted: false },
      { id: 1, department: 1, status: 1, deleted: 1 },
      (err, department) => {
        // Check if error was found or not
        if (err) {
          res.json({ success: false, message: err }); // Return error message
        } else {
          // Check if blogs were found in database
          if (!department || department.length === 0) {
            res.json({
              success: false,
              message: "No Department found.",
              department: [],
            }); // Return error of no blogs found
          } else {
            res.json({ success: true, department: department }); // Return success and blogs array
          }
        }
      }
    ).sort({ _id: -1 }); // Sort blogs from newest to oldest
  });

  router.post("/findDepartmentById", (req, res) => {
    Department.findOne(
      { id: req.body.id },
      "-deleted -__v",
      function (err, department) {
        if (err) {
          res.json({ success: false, message: "Department not found" });
        } else {
          // Check if blogs were found in database
          if (!department) {
            res.json({ success: false, message: "No Department found." });
          } else {
            res.json({ success: true, department: department });
          }
        }
      }
    );
  });

  router.post("/addDepartment", (req, res) => {
    const { department } = req.body;
    if (!department) {
      return res.json({
        success: false,
        message: "You must provide an Department Name",
      });
    }

    const departmentData = {
      id: uuidv4(),
      department: req.body.department.toLowerCase(),
    };

    Department.create(departmentData)
      .then((data) =>
        res.json({
          success: true,
          message: "This department is successfully Added ",
          data: { department: data.department },
        })
      )
      .catch((err) => {
        if (err.code === 11000) {
          res.json({
            success: false,
            message: "Department Name already exists ",
            err: err.message,
          });
        } else if (err.errors) {
          const errors = Object.keys(err.errors);
          res.json({ success: false, message: err.errors[errors[0]].message });
        } else {
          res.json({
            success: false,
            message: "Could not add department Error : " + err.message,
          });
        }
      });
  });

  router.put("/deleteDepartment", (req, res) => {
    let data = req.body;

    Department.deleteOne(
      {
        id: data.id,
      },
      (err, results) => {
        console.log(results);
        if (err) {
          res.json({
            success: false,
            message: "Could not Delete Department" + err,
          });
        } else {
          res.json({
            success: true,
            message: " Successfully Deleted the Department",
            data: results,
          });
        }
      }
    );
  });

  router.put("/setInactiveDepartment", (req, res) => {
    let data = req.body;

    Department.findOne(
      {
        id: data.id,
      },
      (err) => {
        if (err) throw err;
        Department.findOneAndUpdate(
          { id: data.id },
          { deleted: true, status: "inactive" },
          { upsert: true, select: "-__v" },
          (err, response) => {
            if (err) return res.json({ success: false, message: err.message });
            if (response) {
              res.json({
                success: true,
                message: " Successfully Delete Department",
                data: response,
              });
            } else {
              res.json({
                success: false,
                message: "Could Delete Department" + err,
              });
            }
          }
        );
      }
    );
  });

  router.put("/changeDepartmentStatus", (req, res) => {
    let data = req.body;
    Department.findOne(
      {
        id: data.id,
      },
      (err, department) => {
        if (err) throw err;
        Department.findOneAndUpdate(
          { id: data.id },
          { status: department.status === "active" ? "inactive" : "active" },
          { upsert: true, select: "-__v" },
          (err, response) => {
            if (err) return res.json({ success: false, message: err.message });
            if (response) {
              res.json({
                success: false,
                message: response,
              });
            } else {
              res.json({
                success: true,
                message: " Successfully Department set Status",
                data: response,
              });
            }
          }
        );
      }
    );
  });

  router.put("/updateDepartment", async (req, res) => {
    let { id, department } = req.body;

    let departmentData = {
      department: department,
    };

    Department.findOneAndUpdate(
      { id: id },
      departmentData,
      { new: true },
      (err, response) => {
        if (err) return res.json({ success: false, message: err.message });
        if (response) {
          res.json({
            success: true,
            message: "Department Information has been updated!",
            data: response,
          });
        } else {
          res.json({
            success: true,
            message: "No Department has been modified!",
            data: response,
          });
        }
      }
    );
  });

  return router;
};
