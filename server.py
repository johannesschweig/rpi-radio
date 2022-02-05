from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import os
import subprocess
import socket
import atexit
import json


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

# enable CORS
CORS(app, headers='Content-Type')

# state
## streams
if socket.gethostname() == 'arch-desktop':
    f = open('./streams.json', 'r')
else:
    f = open('/home/pi/rpi-radio/streams.json', 'r')
streams = json.load(f)['streams']
## playing
playing = -1
## volume 0-1
volume = 100

@app.route('/get-state', methods=['POST'])
def get_state():
    global playing
    global volume
    return jsonify({
        'playing': str(playing),
        'volume': str(volume)
    })
    
@app.route('/click-stream', methods=['POST'])
def click_stream():
    stream_id = request.json['index']

    global playing
    ## stop current stream
    if playing == stream_id:
        playing = -1
        subprocess.Popen(['mpc', 'stop'])
        return str(-1)

    else:
        ## start new stream
        playing = stream_id
        subprocess.Popen(['mpc', 'play', str(stream_id + 1)])
        # response = jsonify({'data': 'Playing stream {} (index: {})'.format(streams[stream_id].name, index)})
        return str(stream_id)

@app.route('/set-volume', methods=['POST'])
def set_volume():
    global volume
    volume = request.json['volume']
    volume100 = round(volume * 100)
    subprocess.Popen(['mpc', 'volume', str(volume100)])
    return str(volume)
   
if __name__ == '__main__':
   app.run()
