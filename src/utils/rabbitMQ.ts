import { Channel, connect } from "amqplib";
import { mqSchema } from "../models/event";
let channel: Channel;
let msg: Object;

export async function initRabbitMQ() {
  const URL = `amqp://${process.env.RABBIT_MQ_USER}:${process.env.RABBIT_MQ_PASSWORD}@${process.env.RABBIT_MQ_IP}:${process.env.RABBIT_MQ_PORT}/${process.env.RABBIT_MQ_vHOST}`;
  channel = await (await connect(URL)).createChannel();
  console.log("✔️   Connected to RabbitMQ");
}

export async function getRabbitMQChannel() {
  if (!channel) {
    await initRabbitMQ();
  }
  return channel;
}

export async function publishToMQ(queueSlug:string, msg: mqSchema) {
   const stringMsg = JSON.stringify(msg);
   const rabbitMQChannel = await getRabbitMQChannel();

   await rabbitMQChannel.assertQueue(queueSlug!);
  
   rabbitMQChannel.sendToQueue(queueSlug!, Buffer.from(stringMsg));
}
