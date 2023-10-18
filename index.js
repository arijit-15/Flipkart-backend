import express from "express";
import Connection from "./database/db.js";
import dotenv from 'dotenv';
import DefaultData from "./default.js";
import Router from "./routes/route.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuid } from "uuid";
import stripe from "stripe";

dotenv.config();
const app = express();
const stripeInstance = stripe(process.env.STRIPE_SECRET);


const PORT = 8080;

// const USERNAME = process.env.DB_USERNAME;
// const PASSWORD = process.env.DB_PASSWORD;

//const stripe = require("stripe")("sk_test_51O26goSCYdCkPYHoT0BuSKm49dejIlwUV5McFiBbGqzsQwjICGuRVQdmNc4SkKre5lots68L7JhWNFj6zxe4D5xK00Fpi3a8o3")

Connection();

app.listen(PORT, () => console.log(`server is working on ${PORT}`)); 
DefaultData();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', Router);


export let paytmMerchantkey = process.env.PAYTM_MERCHANT_KEY;
export let paytmParams = {};
paytmParams['MID'] = process.env.PAYTM_MID,
paytmParams['WEBSITE'] = process.env.PAYTM_WEBSITE,
paytmParams['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID,
paytmParams['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE_ID,
paytmParams['ORDER_ID'] = uuid(),
paytmParams['CUST_ID'] = process.env.PAYTM_CUST_ID,
paytmParams['TXN_AMOUNT'] = '100',
paytmParams['CALLBACK_URL'] = 'http://localhost:8080/callback'
paytmParams['EMAIL'] = 'kunaltyagi@gmail.com'
paytmParams['MOBILE_NO'] = '1234567852'

app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;

    const lineItems = products.map((products) => {
        const discount = parseFloat(products.discount.replace('%', ''));
        const mrp = parseFloat(products.mrp);
        const cost = parseFloat(products.cost);

        if (!isNaN(discount) && !isNaN(mrp) && !isNaN(cost)) {
            const discountedPrice = cost + (mrp - cost) * (discount / 100);
            const priceInCents = parseInt(discountedPrice * 100);

            if (!isNaN(priceInCents) && priceInCents > 0) {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: products.id,
                        },
                        unit_amount: priceInCents,
                    },
                    quantity: 1,
                };
            }
        }

        console.log(`Invalid price for product: ${products.id}`);
        return null;
    }).filter((lineItem) => lineItem !== null);

    if (lineItems.length > 0) {
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });
    } else {
        res.status(400).json({ error: "No valid line items to create a session." });
    }
});
 



