#! /bin/bash
cd ../app
dotenv -e ../.env -- npx prisma generate --schema src/prisma/schema.prisma