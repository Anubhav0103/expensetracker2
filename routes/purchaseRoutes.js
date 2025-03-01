const express = require("express");
const Razorpay = require("razorpay");
const db = require("../config/db"); // ✅ Corrected file name
 // Ensure you have a database connection
const router = express.Router();

const razorpay = new Razorpay({
    key_id: "rzp_test_cNdwDn00jRSuoN",
    key_secret: "jip7vCslNxD2RZjCMTwSssSA"
});

// ✅ Create Order and Store in DB
router.post("/membership", async (req, res) => {
    try {
        const { userId } = req.body; // ✅ Ensure userId is being received

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const options = {
            amount: 3000, // ₹30 in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // ✅ Correcting the INSERT query (Your table has userId, orderId, status)
        await db.query("INSERT INTO orders (orderId, userId, status) VALUES (?, ?, ?)", 
            [order.id, userId, "PENDING"]);

        res.json({ orderId: order.id, key_id: "rzp_test_cNdwDn00jRSuoN" });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



const crypto = require("crypto");

// ✅ Verify Payment and Update Status
router.post("/verify", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    const secret = "jip7vCslNxD2RZjCMTwSssSA"; // Razorpay Secret Key
    const generated_signature = crypto.createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generated_signature === razorpay_signature) {
        // ✅ Use Promise.all() for faster DB updates
        await Promise.all([
            db.query("UPDATE orders SET status = 'SUCCESSFUL' WHERE orderId = ?", [razorpay_order_id]),
            db.query("UPDATE users SET isPremium = true WHERE id = ?", [userId])
        ]);

        return res.json({ success: true, message: "Transaction Successful!" });
    } else {
        await db.query("UPDATE orders SET status = 'FAILED' WHERE orderId = ?", [razorpay_order_id]);
        return res.status(400).json({ success: false, message: "Transaction Failed" });
    }
});

module.exports = router;
