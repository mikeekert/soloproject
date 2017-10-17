var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

router.get('/', function (req, res) {
        console.log('get /user route');
        // check if logged in
        if (req.isAuthenticated()) {
            pool.connect(function (conErr, client, done) {
                if (conErr) {
                    console.log(conErr);
                    res.sendStatus(500);
                } else {
                    const dbId = req.user.username;
                    const queryGet = "SELECT games.*, junction_user_game.progress FROM users JOIN junction_user_game ON users.id = junction_user_game.user_id JOIN games ON junction_user_game.game_id = games.id WHERE users.username = $1";
                    client.query(queryGet, [dbId], function (queryErr, resultObj) {
                        done();
                        if (queryErr) {
                            console.log(queryErr);
                            res.sendStatus(500);
                        } else {
                            res.send(resultObj.rows);
                            console.log(resultObj.rows);
                        }
                    });
                }
            });

    // send back user object from database
}
else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
}
});

module.exports = router;
