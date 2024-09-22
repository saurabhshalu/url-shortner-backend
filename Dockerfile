FROM node:16-alpine AS frontend 
WORKDIR /url-shortner-frontend
COPY url-shortner-frontend/package.json .
RUN npm i --force

COPY ./url-shortner-frontend/ .
RUN npm run build

FROM node:18-alpine AS final

WORKDIR /app

COPY package.json .
RUN npm i --force

COPY --from=frontend /url-shortner-frontend/dist/url-shortner-frontend/ ./build
COPY src .

EXPOSE 3000

CMD ["node", "api.js"]
