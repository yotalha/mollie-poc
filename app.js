"use strict";

const express = require("express");

const app = express();
const { createMollieClient } = require("@mollie/api-client");

const mollieClient = createMollieClient({
  apiKey: "test_G6WUAvAhSzSkDu2D9VnHSxmM6xTg9g",
}); // Replace with your test API key

app.post("/create-payment", async (req, res) => {
  try {
    const payment = await mollieClient.payments.create({
      amount: {
        value: "10.00", // You must send the correct number of decimals, thus using a string
        currency: "EUR",
      },
      description: "My first API payment",
      redirectUrl: "https://yourapp.com/payment-success",
      webhookUrl: "https://yourapp.com/webhook", // Optional webhook for payment status updates
    });

    res.json(payment.getCheckoutUrl()); // Send the payment URL to the client
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating payment");
  }
});

app.post("/webhook", async (req, res) => {
  const paymentId = req.body.id;

  try {
    const payment = await mollieClient.payments.get(paymentId);

    if (payment.isPaid()) {
      // Handle payment success
      console.log("Payment successful!");
    } else {
      // Handle payment failure
      console.log("Payment failed or is pending.");
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error handling webhook");
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
