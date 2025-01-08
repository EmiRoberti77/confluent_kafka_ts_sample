import { KafkaJS } from "@confluentinc/kafka-javascript";
import dotenv from "dotenv";
import { EnvConfig, envSchema, KafkaConfig, TopicMessage } from "./types";
dotenv.config();

const config: EnvConfig = {
  "bootstrap.servers": process.env.bootstrap_servers!,
  "sasl.username": process.env.sasl_username!,
  "sasl.password": process.env.sasl_password!,
  "sasl.mechanism": process.env.sasl_mechanism!,
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
