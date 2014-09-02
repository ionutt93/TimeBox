'use strict'
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TaskSchema = new Schema({
	name: { type: String, required: true },
	completed: { type: Boolean, default: false },
	// pomodoros: { type: Number, min: 1, default: 1 },
	group: { type: Schema.ObjectID, ref: 'Group' }
});

module.exports = mongoose.model('Task', TaskSchema);