#! /bin/bash
cd ../app
sudo docker exec -it bibliotecadebolso_backend node prisma/seeds/db.seed.js