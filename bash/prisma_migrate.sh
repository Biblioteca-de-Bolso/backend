cd ../app
dotenv -e ../.env -- npx prisma migrate dev --name mig --schema src/prisma/schema.prisma