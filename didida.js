var steam = require('./index')
var converter = require('json-2-csv')
const fs = require ('fs')


/* steam.find(function (err, game) {
    if (err) return console.log(err);
    //game is the data as a JSON.
    console.log('Converting JSON to CSV...')
    var csv = converter.json2csv(game, function (err, product) {
        if (err) throw err;
        console.log('conversion done!')
        console.log('Now saving to file export.csv...')
        fs.open('./export.csv', 'w', (err, fd) => {
            if (err) throw err;
            fs.write(fd, product, function(err) {
                if (err) throw err;
                console.log('File has been saved successfully!')
            })
        })
    })
}); */

/*
steam.findGame({ search: 'Creed' }, function (err, game) {
    if (err) return console.log(err);
    //game is the data as a JSON.
    console.log('Converting JSON to CSV...')
    var csv = converter.json2csv(game, function (err, product) {
        if (err) throw err;
        console.log('conversion done!')
        console.log('Now saving to file export.csv...')
        fs.open('./export.csv', 'w', (err, fd) => {
            if (err) throw err;
            fs.write(fd, product, function(err) {
                if (err) throw err;
                console.log('File has been saved successfully!')
            })
        })
    })
});
*/

steam.findGenre({ tag: 'strategy', type: 'games', page: 2 }, function (err, game) {
    if (err) return console.log(err)
    //game is the data as a JSON.
    console.log('Converting JSON to CSV...')
    var csv = converter.json2csv(game, function (err, product) {
        if (err) throw err;
        console.log('conversion done!')
        console.log('Now saving to file export.csv...')
        fs.open('./export.csv', 'w', (err, fd) => {
            if (err) throw err;
            fs.write(fd, product, function(err) {
                if (err) throw err;
                console.log('File has been saved successfully!')
            })
        })
    })
});
