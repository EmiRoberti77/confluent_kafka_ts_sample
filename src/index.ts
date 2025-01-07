import { KafkaJS } from "@confluentinc/kafka-javascript";
import { z } from "zod";
import dotenv from "dotenv";
import { TopicMessage } from "./types";
dotenv.config();

const envSchema = z.object({
  "bootstrap.servers": z.string(),
  "sasl.username": z.string(),
  "sasl.password": z.string(),
  "sasl.mechanism": z.string(),
  //"security.protocol": z.string(),
  "session.timeout.ms": z.number(),
  "client.id": z.string(),
});

type EnvConfig = z.infer<typeof envSchema>;

type KafkaConfig = EnvConfig & {
  "group.id": string;
  "auto.offset.reset": string;
  "security.protocol":
    | "sasl_ssl"
    | "plaintext"
    | "ssl"
    | "sasl_plaintext"
    | undefined;
};

const config: EnvConfig = {
  "bootstrap.servers": process.env.bootstrap_servers!,
  "sasl.username": process.env.sasl_username!,
  "sasl.password": process.env.sasl_password!,
  "sasl.mechanism": process.env.sasl_mechanism!,
  //"security.protocol": process.env.security_protocol!,
  "session.timeout.ms": parseInt(process.env.session_timeout_ms!),
  "client.id": process.env.client_id!,
};

envSchema.parse(config);

const kafkaConfig: KafkaConfig = {
  ...config,
  "group.id": "nodejs-group-1",
  "auto.offset.reset": "earliest",
  "security.protocol": "sasl_ssl",
};

async function consume(topic: string) {
  const disconnect = () => {
    consumer.commitOffsets().finally(() => {
      consumer.disconnect();
    });
  };
  process.on("SIGTERM", disconnect);
  process.on("SIGINT", disconnect);
  const consumer = new KafkaJS.Kafka({}).consumer(kafkaConfig);
  await consumer.connect();
  await consumer.subscribe({ topics: [topic] });
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`${topic}:${partition}:${message.value?.toString("utf-8")}`);
      const topicMessage: TopicMessage = JSON.parse(
        message.value?.toString("utf8")!
      );
      console.log(topicMessage);
    },
  });
}

async function main() {
  await consume("topic_emi_2");
}

main();
