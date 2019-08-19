jada-cv
========

My CV. I wrote this over 5 years ago at university.

## Install
```
npm i
```

## Build
```
npm run build;
```

## Run locally
```
./node_modules/.bin/http-server build -p 8080;
```

## Starting in production (legacy)
```
forever start ./node_modules/.bin/http-server -p 1024 build --cors
```
