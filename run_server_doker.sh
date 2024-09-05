#!/bin/bash

npm i

npm run build

docker build -t website_monument_viewer:latest .

docker stop website_monument_viewer

docker rm website_monument_viewer

docker run -d -p 443:3000 -v ~/logs:/usr/src/app/logs --restart unless-stopped --name website_monument_viewer website_monument_viewer:latest
