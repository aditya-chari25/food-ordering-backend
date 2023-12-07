const express = require('express');
const kafka = require('kafka-node');

app.use(express());

const ORDER_KAFKA_TOPIC = process.env.KAFKA_TOPIC;
const ORDER_LIMIT = 20000;

const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: process.env.KKAFKA_BOOTSTRAP_SERVERS });
const producer = new Producer(client);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateOrder = async () => {
  console.log('Going to be generating order after 10 seconds');
  console.log('Will generate one unique order every 10 seconds');
  await sleep(10000);

  for (let i = 1; i < ORDER_LIMIT; i++) {
    const payloads = [
      {
        topic: ORDER_KAFKA_TOPIC,
        messages: JSON.stringify({
          order_id: i,
          user_id: `tom_${i}`,
          total_cost: i * 5,
          items: 'burger,sandwich',
        }),
      },
    ];

    producer.send(payloads, (err, data) => {
      if (err) {
        console.error(`Error sending message: ${err}`);
      } else {
        console.log(`Done Sending..${i}`);
      }
    });

    // await sleep(10000);
  }

  producer.close();
};

// app.get('/generate-orders', async (req, res) => {
//   await generateOrder();
//   res.send('Orders generated successfully!');
// });

setTimeout(generateOrder, 5000)

app.listen(process.env.PORT)