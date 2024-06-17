const mongoose = require('mongoose');
const { isEmail } = require('validator');
const dotenv = require('dotenv');

// Load environment variables from a .env file if present
dotenv.config();

const uri = process.env.DATABASE_URL; // Ensure DATABASE_URL is defined in your .env file

// Connect to MongoDB with error handling
mongoose.connect(uri)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('Error connecting to MongoDB:', err));


// Define the User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    trim: true
  },
  email: {
    type: String,
    required: false,
    maxlength: 40,
    validate: [isEmail, 'Invalid email address'],
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  gender: {
    type: String,
    required: false,
    enum: ['Male', 'Female', 'Other'] // Assuming you want to restrict to certain values
  },
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }]
}, { timestamps: true }); // Adding timestamps to track creation and modification times


// Define the Address schema
const AddressSchema = new mongoose.Schema({
  flatNo: {
    type: String,
    required: false,
    trim: true
  },
  street: {
    type: String,
    required: false,
    trim: true
  },
  city: {
    type: String,
    required: false,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid 6-digit pincode!`
    }
  }
}, { timestamps: true }); // Adding timestamps to track creation and modification times


// Create models for User and Address
const User = mongoose.model('User', UserSchema);
const Address = mongoose.model('Address', AddressSchema);

module.exports = { User, Address };
