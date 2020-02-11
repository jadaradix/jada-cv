cd src;
  # npm i;
  rm -rf build;
  mkdir -p build;
  mkdir -p build/css;
  cp -r static build/static;
  for i in $(find sass/*.scss -maxdepth 0); do ./node_modules/.bin/node-sass $i --output build/css --output-style compressed ; done
  cd content;
    ../node_modules/.bin/pug index.pug && mv index.html ../build/index.html;
  cd ..;
cd ..;

# docker stop jada-cv;
# docker rm jada-cv;
# docker build -t jada-cv .;

# docker tag jada-cv eu.gcr.io/euphoric-adventures/jada-cv:latest;
# docker push eu.gcr.io/euphoric-adventures/jada-cv:latest;
