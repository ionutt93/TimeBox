'use strict'
module.exports = function (app) {
    var Group = require('../models/group');
    var Task = require('../models/task');
    // Server routes ===========================

    // Gets all groups
    app.get('/api/groups', function (req, res) {
        Group.find(function (err, groups) {
            if (err)
                res.send(err);

            res.json(groups);
        });
    });

    // Creates a group
    app.post('/api/groups', function (req, res) {
        Group.create({
            name: req.body.name,
            order: req.body.order
        }, function (err, group) {
            if (err) 
                console.log(err);

            res.json(group);
        });
    });

    // Gets a single task
    app.get('/api/tasks/:task_id', function (req, res) {
        Task.find({ id: req.params.task_id }, function (err, task) {
            if (err)
                res.send(err);

            res.json(task);
        });
    });

    // Gets all tasks from a specific group
    app.get('/api/groups/:group_id/tasks', function (req, res) {
        Task.find({ group: req.params.group_id }, function (err, tasks) {
            if (err)
                res.send(err);

            res.json(tasks);
        });
    });

    // Creates a task within a group
    app.post('/api/groups/:group_id/tasks', function (req, res) {
        Task.create({
            description: req.body.description,
            completed: false,
            order: req.body.order,
            group: req.params.group_id
        }, function (err, task) {
            if (err) 
                res.send(err);

            res.json(task);
        });
    });

    // Front end routes ========================
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });
};
