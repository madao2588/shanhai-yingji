FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV PORT=4173
ENV SHANHAI_DATA_DIR=/data

EXPOSE 4173

# Runtime command: npm run serve
CMD ["npm", "run", "serve"]
