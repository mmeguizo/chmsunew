const Customer = require("../models/customer"); // Import Customer Model Schema
const { v4: uuidv4 } = require("uuid");
const hash = require("../config/password-hasher");
let bcrypt = require("bcryptjs");

module.exports = (router) => {
  router.get("/getAllCustomer", (req, res) => {
    // Search database for all blog posts
    Customer.find({ deleted: false }, {}, (err, customer) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!customer) {
          res.json({ success: false, message: "No Customer found." }); // Return error of no blogs found
        } else {
          res.json({ success: true, customer: customer }); // Return success and blogs array
        }
      }
    }).sort({ _id: -1 }); // Sort blogs from newest to oldest
  });

  router.post("/addCustomer", (req, res) => {
    if (!req.body.email) {
      res.json({ success: false, message: "You must provide an email" });
    } else {
      if (!req.body.name) {
        res.json({ success: false, message: "You must provide an username" });
      } else {
        let customer = new Customer({
          id: uuidv4(),
          email: req.body.email.toLowerCase(),
          name: req.body.name.toLowerCase(),
          address: req.body.address.toLowerCase(),
          attachment: req.body.attachment,
          notes: req.body.notes.toLowerCase(),
          company: req.body.company.toLowerCase(),
          phone: req.body.phone,
          open_balance: req.body.open_balance,
        });

        customer.save((err, data) => {
          if (err) {
            if (err.code === 11000) {
              res.json({
                success: false,
                message: `${err.keyValue.email} already exists`,
                err: err.message,
              });
            } else {
              if (err.errors) {
                res.json({
                  success: false,
                  message: "Could not save customer Error : " + err,
                });
              }
            }
          } else {
            res.json({
              success: true,
              message: "Customer added successfully",
              data: { email: data.email, name: data.name },
            });
            // globalconnetion.emitter('customer')
          }
        });
      }
    }
  });

  router.put("/deleteCustomer", (req, res) => {
    let data = req.body;

    Customer.deleteOne(
      {
        id: data.id,
      },
      (err, customer) => {
        if (err) {
          res.json({
            success: false,
            message: "Could not Delete Customer" + err,
          });
        } else {
          res.json({
            success: true,
            message: " Successfully Deleted the Customer",
            data: customer,
          });
          // globalconnetion.emitter('customer')
        }
      }
    );
  });

  router.put("/changeCustomerStatus", (req, res) => {
    let data = req.body;
    Customer.findOne(
      {
        id: data.id,
      },
      (err, customer) => {
        if (err) throw err;
        Customer.findOneAndUpdate(
          { id: data.id },
          { status: data.status },
          { upsert: true },
          (error, response) => {
            if (error)
              return res.json({ success: false, message: error.message });
            if (response) {
              res.json({
                success: true,
                message: `Successfully Customer set to ${data.status} Status`,
                data: response,
              });
            } else {
              res.json({
                success: false,
                message:
                  `Could not set Customer to ${data.status} Status` + response,
              });
            }
          }
        );
      }
    );
  });

  router.put("/updateCustomer", (req, res) => {
    let data = req.body;
    let customerData = {};

    Customer.findOne({ id: data.id }, async (err, docs) => {
      //check old password against the database

      if (err) {
        res.json({
          success: false,
          message: "Error unable to Process Profile update: " + err,
        });
      } else {
        customerData.email = data.email;
        customerData.name = data.name;
        customerData.address = data.address;
        customerData.company = data.company;
        customerData.phone = data.phone;
        customerData.open_balance = data.open_balance;
        customerData.notes = data.notes;
        customerData.status = data.status;
        Customer.findOneAndUpdate(
          { id: data.id },
          customerData,
          { upsert: true },
          (err, response) => {
            if (err) return res.json({ success: false, message: err.message });
            if (response) {
              res.json({
                success: true,
                message: "Customer Information has been updated!",
                data: response,
              });
            } else {
              res.json({
                success: true,
                message: "No Customer has been modified!",
                data: response,
              });
            }
          }
        );
      }
    });
  });

  router.put("/findById", (req, res) => {
    // Customer.findOne({ id: req.decoded.customerId }).select('name email').exec((err, customer) => {
    Customer.findOne({ id: req.body.id })
      .select()
      .exec((err, customer) => {
        if (err) {
          res.json({ success: false, message: err.message });
        } else {
          if (!customer) {
            res.json({ success: false, message: "Customer not found" });
          } else {
            res.json({ success: true, data: customer });
          }
        }
      });
  });

  return router;
};
