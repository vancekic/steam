var steam = require('steam-searcher')


steam.find({ search: { genres: [ { id: '2', description: 'Action' } ]} }, function (err, game) {
    if (err) console.log(err);
    //game is the data as a JSON.
    console.log(game.name)
    console.log(game.categories)
});

