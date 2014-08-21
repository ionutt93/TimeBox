'use strict'
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ListSchema = new Schema({
	name: { type: String, required: true },
	project: { type:Schema.ObjectID, ref: 'Project' }
});

module.exports = mongoose.model('List', ListSchema);