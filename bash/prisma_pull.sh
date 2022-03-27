cd ../app
dotenv -e ../.env -- npx prisma db pull --schema src/prisma/schema.prisma