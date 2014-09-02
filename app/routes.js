'use strict'
module.exports = function (app) {
    // Server routes ===========================
    app.get('/api/groups', function (req, res) {
        Group.find(function (err, groups) {
            if (err)
                res.send(err);

            res.json(groups);
        });
    });

    app.get('/api/groups/:group_id/tasks/:task_id', function (req, res) {
        Task.find({ group: req.params.group_id }, function(err, tasks) {
            if (err)
                res.send(err);

            res.json(tasks);
        });
    });

    app.post('/api/groups/:group_id/tasks', function (req, res) {
        Task.create({
            name: req.body.name,
            completed: false,
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
