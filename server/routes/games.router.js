var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');

const igdb = require('igdb-api-node').default;
require('dotenv').config();

global['3scaleKey'] = process.env.IGDB_API;
const client = igdb();




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
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

router.post('/api/:id', function (req, res) {

    if (req.isAuthenticated()) {
        client.games({
            search: req.params.id,
            // order: 'popularity:desc',
            fields: '*', // Return all fields
            limit: 20, // Limit to 5 results
            offset: 0, // Index offset for results

        }).then(response => {
            console.log('my array of games length:',response.body.length);

            j = response.body.length;
            while (j--) {
            // for (var j = 0; j < response.body.length; j++) {
                if ( response.body[j].hasOwnProperty('cover') === false ) {
                    console.log(response.body[j].name, ' has no image');
                    response.body.splice(j,1);
                } else if ( response.body[j].name.includes('Collector') ) {
                    console.log('***', response.body[j].name, '*** removed!');
                    response.body.splice(j,1);
                } else if ( response.body[j].name.includes('Edition') ) {
                    console.log('***', response.body[j].name, '*** removed!');                    
                    response.body.splice(j,1);
                 } else {
                    console.log('setting up image for:', response.body[j].name);
                    response.body[j].image = client.image({
                        cloudinary_id: response.body[j].cover.cloudinary_id
                    }, 'cover_small_2x', 'jpg');
                }
            }
            response.body.splice(5, response.body.length);

            // console.log(response.body);
            res.send(response.body);
        }).catch(error => {
            throw error;
        });
        // send back user object from database
        client.platforms({
            search: '*',
            // order: 'popularity:desc',
            fields: '*', // Return all fields
            limit: 20, // Limit to 5 results
            offset: 0, // Index offset for results

        }).then(responsePlat=>{
console.log(responsePlat);
        });
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

module.exports = router;