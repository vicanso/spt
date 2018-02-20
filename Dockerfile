FROM node:alpine

ADD ./ /app

RUN cd /app \
  && npm i --production \
  && npm cache clean --force \
  && npm run gen-version
CMD ["node", "--experimental-modules", "/app/app"]