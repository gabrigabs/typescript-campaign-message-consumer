import mongodb from './db/mongo.db';

async function main(): Promise<void> {
  await mongodb.connect();
}

main();
