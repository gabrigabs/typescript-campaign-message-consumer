import mongodb from './db/mongodb';

async function main(): Promise<void> {
  await mongodb.connect();
}

main();
