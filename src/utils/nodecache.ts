import nodeCache from "node-cache";
import { getDbClient } from "./database";
import { eventSchema } from "../models/event";
import { pollSchema } from "../models/poll";
import { roleSchema } from "../models/reactionRole";
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
    const events = await db.collection("events").find<eventSchema>({});
    await events.forEach((event: eventSchema) => {
      cache.set(`event-${event.slug}-${event.type}`, JSON.stringify(event));
    });
    const polls = await db.collection("polls").find<pollSchema>({});
    await polls.forEach((poll: pollSchema) => {
      cache.set(`poll-${poll.pollID}`, JSON.stringify(poll));
    });
    const roles = await db.collection("reaction-roles").find<roleSchema>({});
    await roles.forEach((role: roleSchema) => {
      cache.set(role.messageID, JSON.stringify(role));
    });
    console.log("✔️   NodeCache Keys Refreshed!");
  } catch (err) {
    throw err;
  }
};

export const getEvent = async (
  slug: string,
  type: "certificate" | "checkin"
): Promise<eventSchema | null> => {
  const event = cache.get(`event-${slug}-${type}`) as string;
  if (event) return JSON.parse(event);
  else return null;
};

export const setEvent = async (event: eventSchema): Promise<boolean> => {
  const result = cache.set(
    `event-${event.slug}-${event.type}`,
    JSON.stringify(event)
  );
  return result;
};

export const getPoll = async (id: string): Promise<pollSchema | null> => {
  const poll = cache.get(`poll-${id}`) as string;
  if (poll) return JSON.parse(poll);
  else return null;
};

export const setPoll = async (poll: pollSchema): Promise<boolean> => {
  const result = cache.set(`poll-${poll.pollID}`, JSON.stringify(poll));
  return result;
};

export const setRole = async (roleData: roleSchema): Promise<boolean> => {
  const result = cache.set(roleData.messageID, JSON.stringify(roleData));
  return result;
};

export const getRole = async (
  messageID: string
): Promise<roleSchema | null> => {
  const roleData = cache.get(messageID) as string;
  if (roleData) return JSON.parse(roleData);
  return null;
};
