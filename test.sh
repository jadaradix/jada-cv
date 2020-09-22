cd src;
  rm -rf build;
  mkdir -p build;
  mkdir -p build/css;
  cp -r static build/static;
  for i in $(find sass/*.scss -maxdepth 0); do ./node_modules/.bin/node-sass $i --output build/css --output-style compressed ; done
  cd content;
    ../node_modules/.bin/pug index.pug && mv index.html ../build/index.html;
  cd ..;

  ./node_modules/.bin/http-server build -p 7001
cd ..;
