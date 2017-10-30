let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const statSchema = new Schema ({
  activityId: {
    type: String
  },

  identifier: {
    type: String
  },

  amount: {
    type: Number
  },

  create_date: {
    type: Date,
    default: Date.now
  }
});





let Stat = mongoose.model('Stat', statSchema);


module.exports = {
		Stat
	}
