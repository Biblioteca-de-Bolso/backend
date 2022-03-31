#! /bin/bash
sudo docker exec -it bibliotecadebolso_backend npx prisma migrate dev --name "$1"
