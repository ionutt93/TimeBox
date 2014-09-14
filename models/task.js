'use strict'
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TaskSchema = new Schema({
	description: { type: String, required: true },
	completed: { type: Boolean, default: false },
	order: { type: Number, required: true },
	completedPomodoros: { type: Number, min: 0, default: 0 }, 
	totalPomodoros: { type: Number, min: 1, default: 1 },
	group: { type: Schema.Types.ObjectId, ref: 'Group' }
});

module.exports = mongoose.model('Task', TaskSchema);