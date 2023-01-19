cd React

yarn build

cd build

aws s3 sync . s3://react-web-frd

-> go to aws cloudfront

-> distribution -> invalidation -> create invalidation 

/*

--------------------------

cd otherBackend

docker build -t kw00hk/frd .
docker push kw00hk/frd

---------------------------------

connect to instance:

sudo su

docker pull kw00hk/frd
cd docker
docker-compose up 
