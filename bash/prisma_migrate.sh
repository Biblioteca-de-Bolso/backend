#! /bin/bash
if [ -z "$1" ]
then
  sudo docker exec -it bibliotecadebolso_backend npx prisma migrate dev
else
  sudo docker exec -it bibliotecadebolso_backend npx prisma migrate dev --name "$1"
fi  
