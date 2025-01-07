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
