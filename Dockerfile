FROM  node:18

WORKDIR /app

COPY package.json yarn.lock ./

# COPY docs ./docs

RUN yarn

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then yarn; \
        else yarn install --production; \
        fi

COPY . .

RUN yarn build 

EXPOSE 5050

CMD ["yarn", "dev"]

# Production stage
# FROM node:18 as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./

# RUN yarn install --production

# COPY --from=development /app/dist ./dist

# CMD ["yarn", "start"]