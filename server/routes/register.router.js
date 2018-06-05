const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../modules/pool.js');
const encryptLib = require('../modules/encryption');

// Handles request for HTML file
router.get('/', function (req, res) {
    // console.log('get /register route');
    res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
});

// Handles POST request with new user data
// Handles POST request with new user data
router.post('/', function (req, res) {
    // console.log('from POST on front end: ', req.body);
    const saveUser = {
        username: req.body.username,
        password: encryptLib.encryptPassword(req.body.password),
        id: req.body.id
    };
    // console.log('new user:', saveUser);

    pool.connect(function (err, client) {
        if (err) {
            // console.log("Error connecting: ", err);
            res.sendStatus(500);
        }
        client.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING users.id",
            [saveUser.username, saveUser.password],
            function (err) {
                client.end();

                if (err) {
                    // console.log("Error inserting data: ", err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
    });

});


module.exports = router;
