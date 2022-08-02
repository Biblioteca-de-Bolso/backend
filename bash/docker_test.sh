#! /bin/bash
sudo docker-compose -f ../docker-compose.test.yml down 
sudo docker-compose -f ../docker-compose.test.yml up --exit-code-from backend_test
sudo docker-compose -f ../docker-compose.test.yml down