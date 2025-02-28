const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents
const userSchema = new Schema({
    email: {type: String, unique: true},
    password: {type: String},
    name: {type: String},
  });
  
  
  // CREATE MODEL
  // The model() method defines a model (User) and creates a collection (books) in MongoDB
  // The collection name will default to the lowercased, plural form of the model name:
  
  const User = mongoose.model("User", userSchema);
  
  
  // EXPORT THE MODEL
  module.exports = User;