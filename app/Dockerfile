FROM node:16-alpine

# Phantom Install

# ENV PHANTOMJS_VERSION=2.1.1

# ENV PHANTOMJS_PATH=/usr/local/bin/phantomjs

# RUN apk update && apk add --no-cache fontconfig curl curl-dev && \
#   cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz | tar xz && \
#   cp -R lib lib64 / && \
#   cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
#   cp -R usr/share /usr/share && \
#   cp -R etc/fonts /etc && \
#   curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${PHANTOMJS_VERSION}-linux-x86_64.tar.bz2 | tar -jxf - && \
#   cp phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs

# Puppeteer Install
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN yarn add puppeteer@13.5.0

# Application

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait

RUN chmod +x /wait

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --silent

COPY . . 