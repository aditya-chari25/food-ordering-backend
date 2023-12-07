const express = require('express');
const kafka = require('kafka-node');

app.use(express())


const emailrunning = () =>{
    const ORDER_CONFIRMED_KAFKA_TOPIC = proces.env.KAFKA_TOPIC;

    const Consumer = kafka.Consumer;
    const client = new kafka.KafkaClient({ kafkaHost: process.env.KKAFKA_BOOTSTRAP_SERVERS});
    const consumer = new kafka.Consumer(client, [{ topic: ORDER_CONFIRMED_KAFKA_TOPIC}]);

    const emailsSentSoFar = new Set();

    console.log('Gonna start listening');

    consumer.on('message', (message) => {
    const consumedMessage = JSON.parse(message.value);
    const customerEmail = consumedMessage.customer_email;

    console.log(`Sending email to ${customerEmail}`);
    emailsSentSoFar.add(customerEmail);
    console.log(`So far emails sent to ${emailsSentSoFar.size} unique emails`);
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

setTimeout(emailrunning,5000)
// app.get('/', (req, res) => {
//   res.send('Express server is running!');
// });

app.listen(process.env.PORT)