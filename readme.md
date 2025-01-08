# Kafka Confluent Cloud Producer and Consumer in Node.js / typescript

This project demonstrates how to use Confluent Cloud with KafkaJS to build a producer and consumer in Node.js. It connects to a Confluent Cloud Kafka cluster, sends messages to a topic, and consumes messages from the same topic.

## Features

- Producer: Publishes JSON messages to a specified Kafka topic.
- Consumer: Subscribes to a Kafka topic and processes incoming messages.
- Graceful Shutdown: Handles SIGTERM and SIGINT signals to ensure clean disconnection.
- Environment Configuration: Uses environment variables for Kafka settings.

## Prerequisites

1. Node.js: Ensure you have Node.js v20 or above installed.
2. Confluent Cloud Account:

   - Set up a Kafka cluster in Confluent Cloud.
   - https://www.confluent.io/get-started/
   - Create an API key and secret for authentication.
   - Create a topic (e.g., topic_emi_2).

3. Environment Variables:

- Create a .env file with the following keys

```bash
bootstrap_servers=<your-bootstrap-servers>
sasl_username=<your-sasl-username>
sasl_password=<your-sasl-password>
sasl_mechanism=plain
session_timeout_ms=30000
client_id=my-kafka-client
```

install dependencies

```
npm install @confluentinc/kafka-javascript dotenv
```

# Producer

```typescript
const producer = new KafkaJS.Kafka({}).producer(kafkaConfig);
await producer.connect();
await producer.send({
  topic,
  messages: [{ key, value }],
});
```

## Counsumer

The consumer subscribes to the specific topic, logs each message and parses it as JSON

## Key code snippets:

- Connect and Subscribe:

```typescript
const producer = new KafkaJS.Kafka({}).producer(kafkaConfig);
await producer.connect();
await producer.send({
  topic,
  messages: [{ key, value }],
});
```

- Process Messages:

```typescript
consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const topicMessage: TopicMessage = JSON.parse(
      message.value?.toString("utf8")!
    );
    console.log(topicMessage);
  },
});
```

- Make sure to disconnet and shutdown cleanly

```typescript
const disconnect = () => {
  consumer.commitOffsets().finally(() => {
    consumer.disconnect();
  });
};
process.on("SIGTERM", disconnect);
process.on("SIGINT", disconnect);
```

## Example Producer output

```json
[
  {
    "topicName": "topic_emi_2",
    "partition": 0,
    "offset": "5"
  }
]
```

## Example Consumer output

```plaintext
topic_emi_2:0:{"event":"emi_producer42","timeStamp":"2025-01-07T14:32:00Z","message":{"user":"emi","id":42}}
{ event: 'emi_producer42', timeStamp: '2025-01-07T14:32:00Z', message: { user: 'emi', id: 42 } }
```
