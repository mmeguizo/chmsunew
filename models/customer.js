const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
const email = require('./validators/user-validators');
const { Schema } = mongoose;


const customerSchema = new Schema({
    id :  { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, lowercase: true, validate: email.emailValidator },
    name: { type: String, required: true },
    address: { type: String, required: true },
    company: { type: String, required: true },
    phone: { type: Number, required: true },
    attachment:[ 

        {
          source :  { type: String, required: true },
          date_added: { type:Date, required:true, default : new Date() },
        }
    
      ],
    open_balance: { type: Number, required: true },
    notes: { type: String, },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
   
  
  });
  
module.exports = mongoose.model('Customer', customerSchema);