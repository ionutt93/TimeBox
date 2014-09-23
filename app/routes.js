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

    // Removes a group and all tasks belonging to it
    app.delete('/api/groups/:group_id', function (req, res) {
        Task.remove({ group: req.params.group_id }, function (err) {
            if (err) 
                res.send(err);
        });

        Group.remove({ _id: req.params.group_id }, function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Succesfully deleted group' });
        })
    });

    // Gets a single task
    app.get('/api/tasks/:task_id', function (req, res) {
        Task.find({ id: req.params.task_id }, function (err, task) {
            if (err)
                res.send(err);

            res.json(task);
        });
    });

    // Updates a task
    app.put('/api/tasks/:task_id', function (req, res) {
        Task.update(
            { _id: req.params.task_id },
            { $set: req.body.updates}, 
            function (err, task) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }

                res.json({ status: 200 });
            });
    });

    // Updates task and the order of those affected by move
    app.put('/api/tasks/:task_id/order', function (req, res) {
        // Repositions tasks from first group
        Task.find({ 
            group: req.body.updates.oldGroupId,
            order: { $gt: req.body.updates.oldOrder }
        }, function (err, tasks) {
            console.log(tasks);
            if (err)
                res.send(err);

            for(var i = 0; i < tasks.length; i++) {
                tasks[i].order -= 1;
                tasks[i].save(function (err) {
                    if (err)
                        res.send(err);
                });
            }
        });

        // Repositions tasks from second group
        Task.find({
            group: req.body.updates.newGroupId,
            order: { $gte: req.body.updates.newOrder }
        }, function (err, tasks) {
            if (err)
                res.sent(err);

            for(var i = 0; i < tasks.length; i++) {
                tasks[i].order += 1;
                tasks[i].save(function (err) {
                    if (err)
                        res.send(err);
                });
            }
        });

        // Update the moved task
        Task.update({ 
            _id: req.params.task_id 
        }, { $set: {
                order: req.body.updates.newOrder,
                group: req.body.updates.newGroupId
            }
        }, function (err, task) {
            if (err)
                res.send(err);

            console.log('Task order and group updated!');
            console.log(task);
            // res.json({ status: 200 });
        })
    });

    function finishRemoving (task_id, tOrder, tGroup, res) {
        Task.remove({ _id: task_id }, function (err, task) {
            if (err)
                res.send("Task is not here");
            console.log('Task removed');
        });

        Task.find({ 
            group: tGroup, 
            order: { $gt: tOrder }
        }, function (err, tasks) {
            if (err)
                res.send(err);

            for(var i = 0; i < tasks.length; i++) {
                tasks[i].order -= 1;
                tasks[i].save(function (err) {
                    if (err)
                        res.send(err);
                });
            }

            res.json({ status: 200 });
        });
    }

    // Deletes a task
    app.delete('/api/tasks/:task_id', function (req, res) {
        var tOrder, tGroup, tId = req.params.task_id;
        var dbTask = Task.find({_id: req.params.task_id}, function (err, tasks) {
            if (err)
                res.send(err);

            tOrder = tasks[0].order;
            tGroup = tasks[0].group;

            finishRemoving(tId, tOrder, tGroup, res);
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
