/** @format */

import { Kafka, Consumer, logLevel } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;

  private consumer: Consumer;
  private brokers: string;

  /**
   * @constructor
   *
   * Constructs a new `KafkaConfig` instance
   */
  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || "localhost:9092";
    this.kafka = new Kafka({
      clientId: "post-producer",
      brokers: [this.brokers],
      logLevel: logLevel.ERROR,
    });
    this.consumer = this.kafka.consumer({
      groupId: "post-consumer",
    });
  }

  /**
   * Connects to the Kafka broker(s) configured in the `KafkaConfig`
   * constructor.
   */
  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log("[Connected Consumer Kafka] 🎉");
    } catch (error) {
      console.error("[❌ ERROR]: ", error);
    }
  }

  /**
   * Subscribes to a Kafka topic.
   * @param {string} topic The name of the topic to subscribe to.
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic: topic,
        fromBeginning: true,
      });
    } catch (error) {
      console.error("[❌ ERROR]: ", error);
    }
  }

  async consume(callback: (message: string) => void): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log("Message recv:", {
            topic,
            value: message.value?.toString(),
            partition,
          });
          callback(JSON.parse(message.value?.toString() || ""));
        },
      });
    } catch (error) {
      console.error("[❌ ERROR]: ", error);
    }
  }

  /**
   * Disconnects from the Kafka broker(s) that this instance is connected to.
   */

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}

export default new KafkaConfig();
