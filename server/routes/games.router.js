var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');
var datatable = require('../modules/datatable');
var _ = require('underscore');
let hltb = require('howlongtobeat');
let hltbService = new hltb.HowLongToBeatService();

const igdb = require('igdb-api-node').default;
require('dotenv').config();

global['3scaleKey'] = process.env.IGDB_API;
const client = igdb();

var hltbpromise = '';

var hltblookup = function (game) {
    return hltbService.search(game);
};

router.post('/', function (req, res) {
    console.log('post /user route');
    // check if logged in
    if (req.isAuthenticated()) {
        pool.connect(function (conErr, client, done) {
            if (conErr) {
                console.log(conErr);
                res.sendStatus(500);
            } else {
                const junctionID = [req.body.user, req.body.progress, req.body.completed, req.body.nowplaying, req.body.timetobeat, req.body.title, req.body.platform, req.body.releasedate, req.body.coverart];
                const junctionQuery = "INSERT into user_game (user_id, progress, completed, nowplaying, timetobeat, title, platform, releasedate, coverart) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

                client.query(junctionQuery, junctionID, function (queryErr, resultObj) {
                    done();
                    if (queryErr) {
                        console.log(queryErr);
                        res.sendStatus(500);
                    } else {
                        res.send(resultObj.rows);
                    }
                });
            }
        });
        // send back user object from database
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

router.post('/hours/:id', function (req, res) {
    console.log('get /user/hours route, name: ', req.params);
    name = req.params.id;
    // check if logged in
    if (req.isAuthenticated()) {
        pool.connect(function (conErr, client, done) {
            if (conErr) {
                console.log(conErr);
                res.sendStatus(500);
            } else {
                hltblookup(name).then(function (resp) {
                    res.send(resp);
                });
            }
        });
        // send back user object from database
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

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
                const queryGet = "SELECT users.username, user_game.* FROM user_game INNER JOIN users ON user_game.user_id = users.id WHERE users.username = $1";
                client.query(queryGet, [dbId], function (queryErr, resultObj) {
                    done();
                    if (queryErr) {
                        console.log(queryErr);
                        res.sendStatus(500);
                    } else {
                        res.send(resultObj.rows);
                    }
                });
            }
        });
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

router.post('/api/:id', function (req, res) {
    response = [];
    if (req.isAuthenticated()) {
        client.games({
            search: req.params.id,
            // order: 'popularity:desc',
            fields: '*', // Return all fields
            limit: 20, // Limit to 5 results
            offset: 0, // Index offset for results
        }).then(response => {
            j = response.body.length;
            while (j--) {
                console.log('#' + j, ': ', response.body[j].name);
                if (response.body[j].hasOwnProperty('cover') === false) {
                    console.log('removing game, no image:', response.body[j].name);
                    response.body.splice(j, 1);
                } else if (response.body[j].name.includes('Collector')) {
                    response.body.splice(j, 1);
                } else if (response.body[j].name.includes('Edition')) {
                    response.body.splice(j, 1);
                } else {
                    response.body[j].image = client.image({
                        cloudinary_id: response.body[j].cover.cloudinary_id
                    }, 'cover_big_2x', 'jpg');
                }
            }
            response.body.splice(5, response.body.length);
            if (response.body.length == 0) {
                res.send(false);
            }
            var newArray = response.body;

            for (var i = 0; i < newArray.length; i++) {
                console.log('id here: ', newArray[i].platforms);
                if (newArray[i].platforms == undefined) {
                    console.log('undefined: ', newArray[i].name);
                } else {
                    newArray[i].system = _.findWhere(datatable, {
                        id: newArray[i].platforms[0]
                    });
                }
                console.log('name here: ', newArray[i].system);
            }
            
            res.send(newArray);
        }).catch(error => {
            console.log('error here:', error);
            res.send(false);
            // throw error;
        });
        // send back user object from database
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.sendStatus(403);
    }
});

router.put('/', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (conErr, client, done) {
            if (conErr) {
                console.log(conErr);
                res.sendStatus(500);
            } else {
                console.log('POST data', req.body);
                const dbId = [req.body.progress, req.body.completed, req.body.timetobeat, req.body.platform, req.body.nowplaying, req.body.user];
                const queryGet = "UPDATE user_game SET progress=$1, completed=$2, timetobeat=$3, platform=$4, nowplaying=$5 WHERE usergame_id = $6 ";
                client.query(queryGet, dbId, function (queryErr, resultObj) {
                    done();
                    if (queryErr) {
                        console.log(queryErr);
                        res.sendStatus(500);
                    } else {
                        res.send(resultObj.rows);
                    }
                });
            }
        });
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

router.delete('/:id', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (conErr, client, done) {
            if (conErr) {
                console.log(conErr);
                res.sendStatus(500);
            } else {
                console.log('DELETE data', req.params.id);
                const dbId = [req.params.id];
                const queryGet = "DELETE FROM user_game WHERE usergame_id = $1";
                client.query(queryGet, dbId, function (queryErr, resultObj) {
                    done();
                    if (queryErr) {
                        console.log(queryErr);
                        res.sendStatus(500);
                    } else {
                        res.send(resultObj.rows);
                    }
                });
            }
        });
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

module.exports = router;