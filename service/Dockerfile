FROM --platform=linux/arm/v7 node:lts

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# install mpd
RUN apt update
RUN apt install -y mpd mpc
# symlink configuration file
RUN mkdir /root/.mpd/
RUN ln -s /workspaces/rpi-radio/service/mpd-pi.conf /root/.mpd/mpd.conf
# RUN mpd
# RUN mpc update
# RUN mpc load streams

EXPOSE 3000
CMD [ "node", "index.js" ]
