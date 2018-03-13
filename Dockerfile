FROM node:alpine

ADD ./ /app

RUN cd /app \
  && yarn install --production \
  && yarn cache clean \
  && npm run gen-version

CMD ["node", "--experimental-modules", "/app/src/app"]

HEALTHCHECK --interval=10s --timeout=3s \
  CMD node --experimental-modules /app/build/check.mjs || exit 1