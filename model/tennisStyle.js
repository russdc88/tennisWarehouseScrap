var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var StyleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
		required: true,
		unique: true,
		text: true
  },
	// `link` is required and of type String
	image: {
		type: String,
		required: true
	},

  link: {
    type: String,
    required: true
	},
	
	headSize: {
		type: Number,
		required: true
	},

	racLength: {
		type: Number,
		required: true
	},
	
	racBalance: {
		type: String,
		required: true
	},

	swingWeight: {
		type: Number,
		required: true
	},


  
});

// This creates our model from the above schema, using mongoose's model method
var tennisStyle = mongoose.model("tennisStyle", StyleSchema);

// Export the Article model
module.exports = tennisStyle;