const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserModel = mongoose.model(
  "User",
  new Schema({
    username: String,
    twitterID: String,
    name: String,
    thumbnail: String
  })
);

module.exports = UserModel;