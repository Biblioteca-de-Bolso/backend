#! /bin/bash
cd ../app
dotenv -e ../.env -- npx prisma db push --schema src/prisma/schema.prisma