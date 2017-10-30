const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema ({
  username: {type: String, lowercase: true},
  date: {type: String, lowercase: true},
  activity: {type: String, lowercase: true},
  amount: Number,
  amountType: {type: String, lowercase: true},
},
  {timestamps: true}
);



const User = mongoose.model('User', userSchema);

module.exports = {
	  User
	}
