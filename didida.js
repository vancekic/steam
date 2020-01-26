var steam = require('steam-searcher')
var converter = require('json-2-csv')
const fs = require ('fs')

steam.find({ search: 'Total War: Three Kingdoms' }, function (err, game) {
    if (err) console.log(err);
    //game is the data as a JSON.
    console.log('Current price = ' + game.price_overview.final_formatted)

    console.log('Converting JSON to CSV...')
    var csv = converter.json2csv(game, function (err, product) {
        if (err) throw err;
        console.log('conversion done!')
        console.log('saving to file export.csv...')
        fs.open('./export.csv', 'w', (err, fd) => {
            if (err) throw err;
            fs.write(fd, product, function(err) {
                if (err) throw err;
                console.log('File has been saved successfully!')
            })
        })
    })
});