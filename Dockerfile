FROM node:alpine

ADD ./ /app

RUN cd /app \
  && yarn install --production \
  && yarn cache clean \
  && npm run gen-version
CMD ["node", "--experimental-modules", "/app/app"]