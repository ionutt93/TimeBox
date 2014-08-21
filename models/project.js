'use strict'
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProjectSchema = new Schema({
	name: { type: String, required: true },
	description: String,
	user: { type: Schema.ObjectID, ref: 'User' }
});

module.exports = mongoose.model('Project', ProjectSchema);