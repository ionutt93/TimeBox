'use strict'
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var GroupSchema = new Schema({
	name: { type: String, required: true }
});

module.exports = mongoose.model('Group', GroupSchema);