//create the basic server
const express = require('express');
const morgan = require('morgan');
//export the top-level function that creates a new application object with all of Express functionality for server
const app = express();
//mount morgan middleware for logging purposes
app.use(morgan('dev'));
//require the array of apps
const apps = require('./playStore-data.js')
//server has GET endpoint that returns a list of all apps in the array by default
app.get('/apps', (req, res) => {
    //destruct request query params with the REQUEST object query method
    const { search = "", sort, genres } = req.query;
    let results;
    //validate request and add logic--if SORT param provided...
    if(sort) {
        //if list is not sorted by rating or app, return an error
        if(!['rating', 'app'].includes(sort)) {
            return res.status(400).send('Sort must be by title or rank.');
        }
    }
    results = apps.filter(app => app.App.toLowerCase().includes(search.toLowerCase()));
     if(sort) {   
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
    }
    if(genres) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
        return res.status(400).send('Genres are action, puzzle, strategy, casual, arcade, and card.');
        }
    }
    console.log(`results is`, results);
    res
        .json(results);
});
module.exports = app;