'use strict'
module.exports = function (app) {
    // Server routes ===========================
    app.get('/api/nerds', function (req, res) {
        Nerd.find(function (err, nerds) {
            if (err)
                res.send(err);

            res.json(nerds);
        });
    });

    // Front end routes ========================
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });
};
