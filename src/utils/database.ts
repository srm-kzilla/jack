import { MongoClient } from "mongodb";
let dbClient: MongoClient;
let eventDbClient: MongoClient;
export async function initDbClient() {
  try {
    if (!process.env.DATABASE_URI) throw new Error("No Database URI");
    dbClient = await MongoClient.connect(process.env.DATABASE_URI);
    console.log("✔️   Connected to Database");
    return dbClient;
  } catch (error) {
    console.log("❌   Failed to connect to Database");
    process.exit(1);
  }
}

export async function getDbClient() {
  if (!dbClient) {
    await initDbClient();
  }
  return dbClient;
}

export async function initEventDbClient() {
  try {
    if (!process.env.EVENT_DATABASE_URI) throw new Error("No Event Database URI");
    eventDbClient = await MongoClient.connect(
      process.env.EVENT_DATABASE_URI
    ) ;
    console.log("✔️   Connected to Event Database");
    return eventDbClient;
  } catch (error) {
    console.log("❌   Failed to connect to Event Database");
    process.exit(1);
  }
}

export async function getEventDbClient() {
  if (!eventDbClient) {
    await initEventDbClient();
  }
  return eventDbClient;
}
