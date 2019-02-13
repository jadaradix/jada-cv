jadaSite
========

My personal website. I wrote this over 4 years ago at university when Pug was called Jade and Angular 1 was hot.

## Local build
npm i;
npm run build;
node_modules/.bin/http-server build -p 8080;

## Starting in jada vm
```
forever start ./node_modules/.bin/http-server -p 1024 build --cors
```
