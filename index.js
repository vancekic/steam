var request = require('request')
var vasync = require('vasync');

function BuildAppIDArray(htmlSrc) {
    const findAppIdRegExp = /data-ds-appid="(\d+)"/g;
    //var arrayAppIDString = htmlSrc.match(findStr);
    //console.log('arrayAppIDString:', arrayAppIDString);
    const appIds = [];
    let matches;
    while (matches = findAppIdRegExp.exec(htmlSrc)) {
        appIds.push(matches[1]);
    }
    console.log('appIds:', appIds);
    return appIds;
    /*
    if (arrayAppIDString && Array.isArray(arrayAppIDString)) {
        let outArray = [];
        appIds.forEach(elem => {
            console.log('elem:', elem);
            outArray.push(parseInt(elem))
        });
        return outArray;
    }
    */
    //return null;
};

function GetAppIDDetails(arrayIDs, callback) {
    let aggData = []
    console.log('arrayIDs:', arrayIDs);
    vasync.forEachParallel({
        func: function fetchAppData(steamID, done) {
            reqUrlGame = `http://store.steampowered.com/api/appdetails?appids=${steamID}`
            console.log('Processing ' + steamID + '...')
            request.get({
                url: reqUrlGame
            }, function (err, res, body) {
                if (err) return done(err);
                if (res.statusCode !== 200) return done(new Error('request failed (' + res.statusCode + ')'));
                if (!body) return done(new Error('failed to get body content'));

                var gameData = JSON.parse(body)
                console.log('Pushing ' + steamID);
                aggData.push(gameData[steamID].data);

                done();
            })
        },
        inputs: arrayIDs
    }, function allGamesFetched(fetchGamesErr, results) {
        if (fetchGamesErr) {
            console.error(`Errors (${results.nerrors}) when fetching games: ${fetchGamesErr}`);
        } else {
            console.log('Operation terminated with SUCCESS.');
        }
        callback(fetchGamesErr, aggData);
    });
};

function FireGeneralRequestFromText(reqUrl, callback) {
    request.get({
        url: reqUrl,
        //timeout: timeout
    }, function (err, res, body) {
        console.log('error:', err);
        console.log('res.status:', res.statusCode);

        if (err) return callback(err);
        if (res.statusCode !== 200) return callback(new Error('request failed (' + res.statusCode + ')'));
        if (!body) return callback(new Error('failed to get body content'));

        console.log('body:', body);
        let appIDArray = BuildAppIDArray(body);
        if (appIDArray) {
            console.log('found text for ' + appIDArray.length + ' games on that page!')
            console.log("Fetching details...")
            GetAppIDDetails(appIDArray, callback);
        } else {
            console.log("No appID was found on the html response to getting that page: " + reqUrl);
        }
    })
};

function FireGeneralRequestFromJSON(timeout, reqUrl, callback) {
    request.get({
        url: reqUrl,
        timeout: timeout
    }, function (err, res, body) {

        if (err) return callback(err);
        if (res.statusCode !== 200) return callback(new Error('request failed (' + res.statusCode + ')'));
        if (!body) return callback(new Error('failed to get body content'));

        // Parse body
        var res1 = JSON.parse(body)
        // for each item found, throw up a request to get them all
        count = res1.items.length;
        console.log('Parsing JSON for ' + count + ' games found...')
        GetAppIDDetails(res1.items)
    })
};

// Init the module
function findFixedUrl(callback) {
    if (typeof callback !== 'function')
        callback = function callback(err, result) {
            return err || result;
        };

        // to get first 100 top selling games, ask for 4 pages of 25 results
        const numberPagesMax = 4;
        //const timeout = 1000;
        const reqUrl = `https://store.steampowered.com/tags/en/Turn-Based%20Strategy/#p=0&tab=TopSellers`;  // page 1
        //let reqUrl = `https://store.steampowered.com/search/?sort_by=Released_DESC&tags=9&category1=998`;
        // TODO: add requets for more pages of results with the following format
        //reqUrl = `https://store.steampowered.com/tags/en/Strategy#p=1&tab=TopSellers`;    // page 2

    return FireGeneralRequestFromText(reqUrl, callback);
};

function findJSON(game, callback) {
    if (typeof callback !== 'function')
        callback = function callback(err, result) {
            return err || result;
        };

    if (!game || typeof game !== 'object')
        return callback('invalid game');

    if (!game.search)
        return callback('missing search input');

    var timeout = 1000,
        search = game.search,
        reqUrl = `http://store.steampowered.com/api/storesearch/?term={${search}}&l=english&cc=US`;

    return FireGeneralRequestFromJSON(timeout, reqUrl, callback);
};

function findGenre(genre, callback) {
    var timeout = 1000,
    genre = genre.search,
    reqUrl = `https://store.steampowered.com/tags/en/${genre}#p=0&tab=ComingSoon`;

    return FireGeneralRequestFromText(timeout, reqUrl, callback);
};

module.exports.find = findFixedUrl;
module.exports.findGame = findJSON;
module.exports.findGenre = findGenre;
