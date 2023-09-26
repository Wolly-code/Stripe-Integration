const express = require('express')
const app = express()
var stripe = require('stripe')('sk_test_51NuWYvARUDxhOMk6TmvAB5e6Fp7OKgqkV1Xv2lzb9ZRoN8L36CfEBt8xrScCqkkGcRkAn6NT6pRvPvhLdajqBEM700Hvv6i9u2');
app.use(express.json());

app.post("/api/new-transaction", async (req, res) => {
    try {

        //destructruing the request
        const { amount, currency, description, paymentMethod } = req.body;

        //Creating a new payment Intent
        const transaction = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            customer: 'cus_OhxadrY6c79B2n',
            description: description,
            payment_method: paymentMethod,
            automatic_payment_methods: { enabled: true },
            confirm: true,
            return_url: 'http://localhost:3000'
        });

        res.json(transaction);

    } catch (err) {

        console.log(err)
        res.status(500).json({ error: err })

        //Logging can be implemented
    }
});

app.post('/api/refund/:id', async (req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await stripe.paymentIntents.retrieve(transactionId);

        if (!transaction) return res.status(400).json({ error: "No transaction found with that Id" })

        const refund = await stripe.refunds.create({
            payment_intent: transactionId,
        });

        res.json(refund);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

app.post("/api/create-subscription", async (req, res) => {
    try {

        //Before we create a subscription we need the following requirements (i.e. Customer, Product and Price)

        //Customer
        const customer = await stripe.customers.create({
            email: "kc.suhant@gmail.com",
            description: 'My First Test Customer (created for API docs at https://www.stripe.com/docs/api)',
        });


        //Product
        const product = await stripe.products.create({
            name: "Apple Watch",
            description: "Apple Watch",
        });


        //Price
        const price = await stripe.prices.create({
            unit_amount: 10,
            currency: "usd",
            product: product.id,
            recurring: { interval: 'month' },
        });

        //Finally the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                { price: price.id }
            ],
        });


        // const subscription = await stripe.subscriptions.create({
        //     customer: 'cus_OhxadrY6c79B2n',
        //     items: [
        //         { price: 'price_1NuXjO2eZvKYlo2CrFo4LKmk' },
        //     ],
        // });
        res.send(subscription)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
})

app.get('/api/getInvoice', async (req, res) => {
    const invoices = await stripe.invoices.list({
        limit: 100,
    });
    res.send(invoices);
})
app.listen(5000, () => {
    console.log("The server is running is port 5000")
});