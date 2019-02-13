cd src;
  npm i;
  npm run build;
cd ..;

docker stop jada-io-cv;
docker rm jada-io-cv;
docker build -t jada-io-cv .;

docker tag jada-io-cv eu.gcr.io/thegmc-219013/jada-io-cv:latest;
docker push eu.gcr.io/thegmc-219013/jada-io-cv:latest;
