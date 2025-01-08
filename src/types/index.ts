import { z } from "zod";
export interface TopicMessage {
  description: string;
  event_type: string;
  properties: Properties;
}

export interface Properties {
  event: Event;
}

export interface Event {
  description: string;
  name: string;
  timeStamp: string;
}

export const envSchema = z.object({
  "bootstrap.servers": z.string(),
  "sasl.username": z.string(),
  "sasl.password": z.string(),
  "sasl.mechanism": z.string(),
  //"security.protocol": z.string(),
  "session.timeout.ms": z.number(),
  "client.id": z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export type KafkaConfig = EnvConfig & {
  "group.id": string;
  "auto.offset.reset": string;
  "security.protocol":
    | "sasl_ssl"
    | "plaintext"
    | "ssl"
    | "sasl_plaintext"
    | undefined;
};
