const express = require('express');
const kafka = require('kafka-node');

app.use(express())

const transaction = () =>{
    const ORDER_KAFKA_TOPIC = process.env.KAFKA_TOPIC1;
    const ORDER_CONFIRMED_KAFKA_TOPIC = process.env.KAFKA_TOPIC2;

    const Consumer = kafka.Consumer;
    const Producer = kafka.Producer;
    const client = new kafka.KafkaClient({ kafkaHost: process.env.PORT });

    const consumer = new Consumer(client, [{ topic: ORDER_KAFKA_TOPIC, partition: 0 }]);
    const producer = new Producer(client);

    const sendOrderConfirmation = (userId, totalCost) => {
    const data = {
        customer_id: userId,
        customer_email: `${userId}@gmail.com`,
        total_cost: totalCost,
    };

    producer.send([{ topic: ORDER_CONFIRMED_KAFKA_TOPIC, messages: JSON.stringify(data) }], (err, data) => {
        if (err) {
        console.error(`Error sending message: ${err}`);
        } else {
        console.log('Message sent successfully:', data);
        }
    });
    };

    console.log('Gonna start listening');

    consumer.on('message', (message) => {
    console.log('Ongoing transaction..');
    const consumedMessage = JSON.parse(message.value);
    console.log(consumedMessage);

    const userId = consumedMessage.user_id;
    const totalCost = consumedMessage.total_cost;

    console.log('Successful transaction..');
    sendOrderConfirmation(userId, totalCost);
    });

    consumer.on('error', (err) => {
    console.error(`Error: ${err}`);
    });

    process.on('SIGINT', () => {
    consumer.close(true, () => {
        console.log('Consumer closed');
        process.exit();
    });
    });

    process.on('exit', () => {
    producer.close(() => {
        console.log('Producer closed');
    });
    });
    }

// app.get('/', (req, res) => {
//   res.send('Express server is running!');
// });
setTimeout(transaction,5000)

app.listen(process.env.PORT)
