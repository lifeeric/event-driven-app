# Event-Driven Posts (EDA)

A minimal event-driven architecture demo built with [Bun](https://bun.sh/), [Hono](https://hono.dev/), Kafka, and MongoDB. It contains a REST producer that publishes post data to Kafka and a consumer that batches the events into MongoDB.

## Components
- `post-producer`: Hono API exposing `POST /create-post` to validate and emit post events to the `post` Kafka topic.
- `post-consumer`: Background service that subscribes to the `post` topic, buffers messages, and bulk-inserts them into MongoDB every 5 seconds or after 100 queued posts.

## How It Works
1. A client sends a request to `POST /create-post` with `title` and `content`.
2. The producer validates the payload with Zod and publishes it to Kafka via `KafkaConfig.sendToTopic`.
3. The consumer subscribes to the same topic, accumulates events, and persists them with `PostModel.insertMany`.
4. Kafka, backed by ZooKeeper (via `docker-compose.yml`), handles message durability between the two services.

## Getting Started
- Start infrastructure: `docker compose up -d` (ZooKeeper + Kafka). Ensure MongoDB is running at `mongodb://localhost:27017/eda-post` (for example via `docker run --name mongo -p 27017:27017 -d mongo`).
- Run the producer: `cd post-producer && bun install && bun run dev` (listens on `http://localhost:3000`).
- Run the consumer: `cd post-consumer && bun install && bun run dev` (initialises the consumer and exposes a health route on port `3001`).
- Optional: override Kafka brokers with `KAFKA_BROKERS=host:port` when starting either service.

## Load Testing with k6
- Scripts live in `post-producer/test/`. The default scenario (`post.test.js`) drives `POST /create-post` with 1,000 virtual users for 30 seconds.
- With both services running, execute `k6 run post-producer/test/post.test.js` to stress the producer endpoint and observe end-to-end queuing/consumption.
- An additional example (`lxw.prod.js`) shows how to target an external GET endpoint; adapt either script to your own workloads or k6 Cloud projects.

## What You Get
- Blueprint for Bun-based services communicating over Kafka.
- Input validation, topic lifecycle management, and graceful batching out of the box.
- Ready-to-run performance testing entry point using k6 for throughput validation.
