# cd src;
#   npm i;
# cd ..;

cd src;
  rm -rf build;
  mkdir -p build;
  mkdir -p build/css;
  cp -r static build/static;
  for i in $(find sass/*.scss -maxdepth 0); do ./node_modules/.bin/node-sass $i --output build/css --output-style compressed ; done
  cd content;
    ../node_modules/.bin/pug index.jade && mv index.html ../build/index.html;
  cd ..;
cd ..;

# docker stop jada-io-cv;
# docker rm jada-io-cv;
# docker build -t jada-io-cv .;

# docker tag jada-io-cv eu.gcr.io/thegmc-219013/jada-io-cv:latest;
# docker push eu.gcr.io/thegmc-219013/jada-io-cv:latest;
