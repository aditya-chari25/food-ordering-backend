const express = require('express');
const kafka = require('kafka-node');
app.use(express())

const ORDER_CONFIRMED_KAFKA_TOPIC = process.env.KAFKA_TOPIC2;

const analytics = ()=>{
    const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
    const consumer = new kafka.Consumer(client, [{ topic: ORDER_CONFIRMED_KAFKA_TOPIC, partition: 0 }]);

    let totalOrdersCount = 0;
    let totalRevenue = 0;

    console.log('Gonna start listening');

    consumer.on('message', (message) => {
    console.log('Updating analytics..');
    const consumedMessage = JSON.parse(message.value);
    const totalCost = parseFloat(consumedMessage.total_cost);

    totalOrdersCount += 1;
    totalRevenue += totalCost;

    console.log(`Orders so far today: ${totalOrdersCount}`);
    console.log(`Revenue so far today: ${totalRevenue}`);
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
}

setTimeout(analytics,5000)
app.listen(process.env.PORT)