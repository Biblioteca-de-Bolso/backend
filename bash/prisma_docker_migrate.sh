#! /bin/bash
sudo docker exec -it bibliotecadebolso_backend npx prisma migrate dev --name "$1" --schema src/prisma/schema.prisma
