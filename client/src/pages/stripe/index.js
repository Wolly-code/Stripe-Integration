import {
    Elements,
    CardElement,
} from "@stripe/react-stripe-js"; 
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import './index.css'
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

export default function StripePayment() {
    const stripe = loadStripe(
        "pk_test_TYooMQauvdEDq54NiTphI7jx"
    );
    return (
        <Elements stripe={stripe}>
            <CheckoutForm />
        </Elements>
    );
};

function CheckoutForm() {
    const [isPaymentLoading, setPaymentLoading] = useState(false);
    return (
        <div
            style={{
                padding: "3rem",
            }}
        >
            <div
                style={{
                    maxWidth: "500px",
                    margin: "0 auto",
                }}
            >
                <form
                    style={{
                        display: "block",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <CardElement
                            className="card"
                            options={{
                                style: {
                                    base: {
                                        backgroundColor: "white"
                                    }
                                },
                            }}
                        />
                        <button
                            className="pay-button"
                            disabled={isPaymentLoading}
                        >
                            {isPaymentLoading ? "Loading..." : "Pay"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}