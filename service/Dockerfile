FROM node:lts

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# install mpd
RUN apt update

EXPOSE 3000
CMD [ "node", "index.js" ]
