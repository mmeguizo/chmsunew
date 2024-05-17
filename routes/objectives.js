const Objectives = require("../models/objective");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const objective = require("../models/objective");

module.exports = (router) => {
  router.get("/getAllObjectives", (req, res) => {
    // Search database for all blog posts
    Objectives.find({ deleted: false }, (err, Objectives) => {
      // Check if error was found or not
      console.log("getAllObjectives", Objectives);

      if (err) {
        return res.status(500).json({ success: false, message: err });
      }

      if (!Objectives || Objectives.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Objectives found.",
          Objectives: [],
        });
      }
      return res.status(200).json({ success: true, Objectives });
    }).sort({ _id: -1 }); // Sort blogs from newest to oldest
  });
  router.get("/getAllByIdObjectives/:id", (req, res) => {
    // Search database for all blog posts
    Objectives.find(
      { deleted: false, goalId: req.params.id },
      (err, Objectives) => {
        // Check if error was found or not
        console.log("getAllObjectives", Objectives);

        if (err) {
          return res.status(500).json({ success: false, message: err });
        }

        if (!Objectives || Objectives.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No Objectives found.",
            Objectives: [],
          });
        }
        return res.status(200).json({ success: true, Objectives });
      }
    ).sort({ _id: -1 }); // Sort blogs from newest to oldest
  });

  router.post("/findObjectivesById", (req, res) => {
    Objectives.findOne(
      { id: req.body.id },
      "-deleted -__v",
      function (err, Objectives) {
        if (err) {
          res.json({ success: false, message: "Objectives not found" });
        } else {
          // Check if blogs were found in database
          if (!Objectives) {
            res.json({ success: false, message: "No Objectives found." });
          } else {
            res.json({ success: true, Objectives: Objectives });
          }
        }
      }
    );
  });

  router.post("/addObjectives", (req, res) => {
    console.log("addObjectives", req.body);

    const objectivesData = req.body;

    if (!objectivesData) {
      return res.json({
        success: false,
        message: "You must provide an Objectives and Action Plan Information",
      });
    }

    const ObjectivesDataRequest = {
      id: uuidv4(),
      ...objectivesData,
    };

    // console.log("ObjectivesDataRequest", ObjectivesDataRequest);
    // res.json({ success: true, ObjectivesDataRequest });
    Objectives.create(ObjectivesDataRequest)
      .then((data) =>
        res.json({
          success: true,
          message:
            "This  Objectives and Action Plan Objectives is successfully Added ",
          data: { Objectives: data.Objectives },
        })
      )
      .catch((err) => {
        if (err.code === 11000) {
          res.json({
            success: false,
            message:
              " Objectives and Action Plan Objectives Name already exists ",
            err: err.message,
          });
        } else if (err.errors) {
          const errors = Object.keys(err.errors);
          res.json({ success: false, message: err.errors[errors[0]].message });
        } else {
          res.json({
            success: false,
            message:
              "Could not add  Objectives and Action Plan Error : " +
              err.message,
          });
        }
      });
  });

  router.put("/deleteObjectives", (req, res) => {
    let data = req.body;

    Objectives.deleteOne(
      {
        id: data.id,
      },
      (err, results) => {
        console.log(results);
        if (err) {
          res.json({
            success: false,
            message: "Could not Delete Objectives" + err,
          });
        } else {
          res.json({
            success: true,
            message: " Successfully Deleted the Objectives",
            data: results,
          });
        }
      }
    );
  });

  router.put("/setInactiveObjectives", (req, res) => {
    let data = req.body;

    Objectives.findOne(
      {
        id: data.id,
      },
      (err) => {
        if (err) throw err;
        Objectives.findOneAndUpdate(
          { id: data.id },
          { deleted: true, status: "inactive" },
          { upsert: true, select: "-__v" },
          (err, response) => {
            if (err) return res.json({ success: false, message: err.message });
            if (response) {
              res.json({
                success: true,
                message: " Successfully Delete Objectives",
                data: response,
              });
            } else {
              res.json({
                success: false,
                message: "Could Delete Objectives" + err,
              });
            }
          }
        );
      }
    );
  });

  router.put("/changeObjectivesStatus", (req, res) => {
    let data = req.body;
    Objectives.findOne(
      {
        id: data.id,
      },
      (err, Objectives) => {
        if (err) throw err;
        Objectives.findOneAndUpdate(
          { id: data.id },
          { status: Objectives.status === "active" ? "inactive" : "active" },
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
                message: " Successfully Objectives set Status",
                data: response,
              });
            }
          }
        );
      }
    );
  });

  router.put("/updateObjectives", async (req, res) => {
    let { id, Objectives } = req.body;

    let ObjectivesData = {
      Objectives: Objectives,
    };

    Objectives.findOneAndUpdate(
      { id: id },
      ObjectivesData,
      { new: true },
      (err, response) => {
        if (err) return res.json({ success: false, message: err.message });
        if (response) {
          res.json({
            success: true,
            message: "Objectives Information has been updated!",
            data: response,
          });
        } else {
          res.json({
            success: true,
            message: "No Objectives has been modified!",
            data: response,
          });
        }
      }
    );
  });

  return router;
};
