
// The {subdomain}.consider.it whose data you want to replicate
var subdomain = process.argv[2] || 'bitcoinclassic'

var bus = require('statebus/server')()
var request = require('request')
var history = {}

// Set to true if you want this node to poll the considerit server every 30 min
// for new data
var continuous = true

// The data that we want to fetch from considerit
keys = ['/proposals?all_points=true', '/subdomain', '/users']
// The all_points=true is so that the /proposals request includes all the published pro/con
// points for each returned proposal. In normal operation, the points are withheld, but 
// accessible at /page/{proposal.slug}

if (continuous)
    setInterval(function () {
        refresh()
    }, 30 * 60 * 1000) // please keep this value respectful

refresh()

// Requests all the data we've specified from the considerit server
function refresh() {
    for (idx in keys) 
        http_fetch(keys[idx])

    // Note when the data was last replicated. Will be available in any client applications.
    refreshed = fetch('/refreshed')
    if (!refreshed.refreshes)
        refreshed.refreshes = []
    refreshed.refreshes.unshift( new Date().getTime() )
    save(refreshed)
}

function http_fetch (key) {
    request({ url: 'https://' + subdomain + '.consider.it' + key,
              headers: {Accept:'application/json', 'X-Requested-With':'XMLHttpRequest'} },

            function (err, response, body) {
                bus.pub(JSON.parse(body))
            })
}

bus('*').on_pub = function (obj) {
    var key = obj.key
    if (!(key in history))
        history[key] = []

    // If this doesn't match the latest item in history
    if (history[key].length === 0
        || !matches(history[key][history[key].length-1], obj)) {

        // Then clone it into the history
        history[key].push(bus.clone(obj))
    }
}

function matches (a, b) { return false }

// Run this server so that client apps can connect to it and access data
bus.serve({port: 9375})
