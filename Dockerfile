FROM node:16-alpine
WORKDIR /VintageShopOnline
ENV PATH="./node_modules/.bin:$PATH"


COPY . ./
CMD ["npm", "start"]