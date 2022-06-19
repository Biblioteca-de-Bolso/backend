FROM node:16-alpine

RUN apk add openjdk11

RUN npm install -g firebase-tools

RUN firebase setup:emulators:storage

WORKDIR /usr/src/firebase

CMD ["firebase", "--project=de-bolso-biblioteca", "emulators:start", "--only", "storage"]