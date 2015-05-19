'use strict'
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var GroupSchema = new Schema({
	name:    { type: String, required: true },
	order:   { type: Number, required: true },
	user:    { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Group', GroupSchema);
