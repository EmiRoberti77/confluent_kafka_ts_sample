import { KafkaJS } from "@confluentinc/kafka-javascript";
import { EnvConfig, envSchema, KafkaConfig } from "./types";
import dotenv from "dotenv";
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

async function producer(topic: string) {
  const key = "1234";
  const id = Math.floor(Math.random() * 100);
  const value = JSON.stringify({
    event: "emi_producer" + id,
    timeStamp: new Date().toISOString(),
    message: {
      user: "emi",
      id,
    },
  });

  const producer = new KafkaJS.Kafka({}).producer(kafkaConfig);
  await producer.connect();
  const producerRecord = await producer.send({
    topic,
    messages: [{ key, value }],
  });
  console.log(JSON.stringify(producerRecord, null, 2));
}

async function main() {
  await producer("topic_emi_2");
}

main();
