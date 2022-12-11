const express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
const { exec } = require("child_process");


  
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// execute command on command line
function execute(cmd) {
  exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  })
}
  
// playing stream: 0-10
var playing = -1
// volume: 0-1
var volume = 1

app.get('/get-state', (req, res, next) => {
    res.send({
        'playing': playing,
        'volume': volume
    })
})

app.post('/set-volume', (req, res, next) => {
    try {
        volume = req.body.volume
        execute(`mpc volume ${Math.round(volume * 100)}`)
        console.log(`Changed volume to ${volume}.`)
        res.status(200).send({
            volume,
            msg: `Changed volume to ${volume}.`
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Could not change volume"
        });
    }
})

app.post('/click-stream', (req, res, next) => {
    try {
        stream_id = req.body.index
        // stop current stream
        if (playing == stream_id) {
            playing = -1
            execute(`mpc stop`)
            console.log(`Stopped current stream ${stream_id}.`)
            res.status(200).send({
                index: -1,
                msg: `Stopped current stream ${stream_id}.`
            })
        } else {
            // start new stream
            playing = stream_id
            execute(`mpc play ${stream_id + 1}`)
            console.log(`Changed stream to ${stream_id}.`)
            res.status(200).send({
                index: stream_id,
                msg: `Changed stream to ${stream_id}.`
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Could not change stream"
        });
    }

})

const server = app.listen(3000, function () {
    let host = server.address().address
    let port = server.address().port
})

