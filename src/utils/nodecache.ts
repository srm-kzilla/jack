import nodeCache from "node-cache";
import { getDbClient } from "./database";
import { eventSchema } from "../models/event";
let cache: nodeCache;
export const initCache = async (): Promise<nodeCache> => {
  try {
    cache = new nodeCache();
    console.log("✔️   Connected to NodeCache");
    return cache;
  } catch (err) {
    throw err;
  }
};

export const refreshKeys = async () => {
  try {
    const db = (await getDbClient()).db();
    const events = await db.collection("events").find<eventSchema>();
    await events.forEach((event: eventSchema) => {
      cache.set(`event-${event.slug}`, JSON.stringify(event));
    });
  } catch (err) {
    throw err;
  }
};

export const getEvent = async (slug: string): Promise<eventSchema | null> => {
  const event = cache.get(`event-${slug}`) as string;
  if (event) return JSON.parse(event);
  else return null;
};

export const setEvent = async (event: eventSchema): Promise<boolean> => {
  const result = cache.set(`event-${event.slug}`, JSON.stringify(event));
  return result;
};
