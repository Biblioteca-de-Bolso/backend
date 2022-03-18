#! /bin/bash
sudo docker-compose -f ../docker-compose.test.yml up --exit-code-from backend --build
sudo docker-compose -f ../docker-compose.test.yml stop