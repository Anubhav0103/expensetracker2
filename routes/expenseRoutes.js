const express = require('express');
const expenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();
router.get('/', authenticate, expenseController.getExpenses);
router.post('/', authenticate, expenseController.addExpense);
router.delete('/:id', expenseController.deleteExpense);
router.post("/webhook", express.json(), async (req, res) => {
    try {
        const event = req.body;

        // Verify the event type
        if (event.event === "payment_link.paid") {
            const userId = event.payload.payment_link.notes.user_id; // Add user ID to notes in Payment Link
            // Add logic to mark the user as premium in your database (if applicable)
            console.log(`User ${userId} has become a premium user.`);

            res.status(200).send("Webhook received and processed");
        } else {
            res.status(400).send("Event not handled");
        }
    } catch (error) {
        console.error("Error handling webhook:", error);
        res.status(500).send("Error processing webhook");
    }
});


module.exports = router;
