cd ../app
dotenv -e ../.env -- npx prisma migrate dev --name $1 --schema src/prisma/schema.prisma