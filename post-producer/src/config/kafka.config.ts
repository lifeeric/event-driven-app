/** @format */

import { Admin, Kafka, Producer, logLevel } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private admin: Admin;
  private producer: Producer;
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
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  /**
   * Connects to the Kafka broker(s) configured in the `KafkaConfig`
   * constructor.
   */
  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.admin.connect();
      console.log("[Connected Kafka] 🎉");
    } catch (error) {
      console.error("[❌ ERROR]: ", error);
    }
  }

  /**
   * Creates a new Kafka topic.
   *
   * @param {string} topic The name of the topic to create.

   */
  async createTopic(topic: string): Promise<void> {
    try {
      await this.admin.createTopics({
        topics: [{ topic, numPartitions: 1 }],
      });
      console.log("[✅] Topic created.");
    } catch (error) {
      console.error("[❌ ERROR]: ", error);
    }
  }

  /**
   * Sends a message to the specified Kafka topic.
   *
   * @param {string} topic The name of the topic to send to.
   * @param {string} message The message to send.
   */
  async sendToTopic(topic: string, message: string): Promise<void> {
    try {
      await this.producer.send({
        topic: topic,
        messages: [{ value: message }],
      });
    } catch (error) {
      console.error("[❌ ERROR]: ", error);
    }
  }

  /**
   * Disconnects from the Kafka broker(s) that this instance is connected to.
   */

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    await this.admin.disconnect();
  }
}

export default new KafkaConfig();
