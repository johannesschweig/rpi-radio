# rpi-radio
A server-client radio for raspberry pi which can play internet radio and local mp3 files.

Frontend uses Node.js and Vue.js and runs on <ip-of-pi>:5000

Backend uses python3 and flask and runs on <ip-of-pi>:5000. Backend uses MPD to play streams.

## Prerequisites
- mpd, mpc

### Changing streams
You can change the audio streams by editing `streams.json` and `mpd/playlists/streams.m3u`. Be sure to exchange the svg icons.

You can add your own mp3 files in mpd/music/.

### Set up mpd
- delete contents of mpd/db/mpd-db
- adjust absolute paths in mpd.conf to your system
- create symlink to mpd.conf in ~/.config/mpd/mpd.conf

## Running in production
### Start mpd
- run mpd with `mpd`
- update database with `mpc update`
- add playlist to mpd with `mpc load streams`
### Start backend
- Run `./backend-start.sh`
### Start frontend
- Run `./frontend-start.sh`
- Go to <ip-of-pi>:5000 with your browser and start a stream

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

