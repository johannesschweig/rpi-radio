FROM node:lts

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# install mpd
RUN apt update
RUN apt install -y mpd mpc
# remove for prod
RUN apt install -y vim systemctl lsof alsa-utils
# symlink configuration file and delete old file
# RUN ln -sf /mpd-pi.conf /etc/mpd.conf
# RUN mpd
# RUN mpc update
# RUN mpc load streams

EXPOSE 3000 6600
CMD [ "node", "index.js" ]
