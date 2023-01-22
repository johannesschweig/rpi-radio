const express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
const mpdapi = require('mpd-api')
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));


// playing stream: 0-10
var playing = -1
// volume: 0-1
var volume = 1

// mdp connection
var client

async function connectMdpClient() {
    await mpdapi.connect({
        host: process.env.STATUS === 'production' ? process.env.PROD_IP : process.env.DEV_IP,
        port: 6600
    }).then((c) => {
        client = c
        client.api.db.update()
        client.api.queue.clear()
        client.api.playlists.load('streams')
        client.api.status.get().then((data) => {
            if (data.hasOwnProperty('state')) {
                if (data.state === 'stop') {
                    playing = -1
                } else {
                    playing = 1
                }
            }
            if (data.hasOwnProperty('volume')) {
                volume = data.volume / 100
            }
            console.log(`Set playing to ${playing} and volume to ${volume}`)
        })
    }).catch(err =>
        console.log('Could not connect to mpd')
    )
}

// middleware to connect to mpd client again if connection is not there
function retryConnection(req, res, next) {
    if (!client) {
        console.log('Retrying mpd connection')
        connectMdpClient()
    }
    next()
}
app.use(retryConnection)



app.get('/get-state', (_req, res, _next) => {
    res.status(200).send({
        'playing': playing,
        'volume': volume
    })
})

app.post('/set-volume', (req, res, _next) => {
    volume = parseFloat(req.body.volume)
    client.api.playback.setvol(Math.round(volume * 100))
        .then(() => {
            console.log(`Changed volume to ${volume}.`)
            res.status(200).send({
                volume,
                msg: `Changed volume to ${volume}.`
            })
        }).catch(err => {
            client = null
            console.log("Could not change volume");
            res.status(502).json({
                msg: "Could not change volume"
            });
        })

})

app.post('/click-stream', (req, res, _next) => {
    stream_id = parseInt(req.body.index)
    // stop current stream
    if (playing == stream_id) {
        playing = -1
        client.api.playback.stop()
            .then(() => {
                console.log(`Stopped current stream ${stream_id}.`)
                res.status(200).send({
                    index: -1,
                    msg: `Stopped current stream ${stream_id}.`
                })
            })
            .catch(err => {
                client = null
                console.log("Could not stop stream");
                res.status(502).json({
                    msg: "Could not stop stream"
                });
            })

    } else {
        // start new stream
        playing = stream_id
        client.api.playback.play(stream_id)
            .then(() => {
                console.log(`Changed stream to ${stream_id}.`)
                res.status(200).send({
                    index: stream_id,
                    msg: `Changed stream to ${stream_id}.`
                })
            })
            .catch(err => {
                client = null
                console.log("Could not change stream");
                res.status(502).json({
                    msg: "Could not change stream"
                });
            })
    }
})

connectMdpClient()
const server = app.listen(3000, function () {
    let host = server.address().address
    let port = server.address().port
})