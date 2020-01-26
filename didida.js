var steam = require('steam-searcher')


steam.find({ search: 'Total War: Three Kingdoms' }, function (err, game) {
    if (err) console.log(err);
    //game is the data as a JSON.
    console.log('Current price = ' + game.price_overview.final_formatted)
});