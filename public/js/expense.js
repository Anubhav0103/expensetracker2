document.addEventListener("DOMContentLoaded", async () => {
    const expenseForm = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expenseList");

    // ✅ Ensure user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Error: User ID not found. Please log in again.");
        window.location.href = "signup.html"; // Redirect to login page
        return;
    }

    // ✅ Fetch existing expenses on page load
    try {
        const response = await fetch("/expense/getAll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }) // ✅ Send userId to fetch user's expenses
        });

        const expenses = await response.json();
        expenses.forEach(exp => {
            const li = document.createElement("li");
            li.textContent = `${exp.amount} - ${exp.description} (${exp.category})`;
            expenseList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Error fetching expenses:", error);
    }

    // ✅ Handle Expense Form Submission
    expenseForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;

        try {
            const response = await fetch("/expense/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, amount, description, category }) // ✅ Include userId
            });

            if (response.ok) {
                location.reload(); // ✅ Refresh page to show new expense
            } else {
                alert("❌ Error adding expense");
            }
        } catch (error) {
            console.error("❌ Error:", error);
            alert("Something went wrong while adding the expense.");
        }
    });
});

// ✅ Handle "Buy Membership" Button Click
document.getElementById("buyMembership").addEventListener("click", async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Error: User ID not found. Please log in again.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/purchase/membership", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }) // ✅ Sending userId in request body
        });

        const data = await response.json();
        
        if (data.orderId) {
            const options = {
                key: "rzp_test_cNdwDn00jRSuoN", // ✅ Use fixed Razorpay Key ID
                amount: 3000, // ₹30 in paise
                currency: "INR",
                name: "Expense Tracker Premium",
                order_id: data.orderId,
                handler: async function (response) {
                    await verifyPayment(response, data.orderId); // ✅ Call verify function
                },
                prefill: {
                    email: localStorage.getItem("userEmail"),
                }
            };

            const razorpay = new Razorpay(options);
            razorpay.open();
        } else {
            alert("❌ Error: Unable to create order.");
        }
    } catch (error) {
        console.error("❌ Error:", error);
        alert("Something went wrong while processing payment.");
    }
});

// ✅ Verify Payment and Update User as Premium
async function verifyPayment(response, orderId) {
    try {
        const res = await fetch("/purchase/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: localStorage.getItem("userId")
            })
        });

        const result = await res.json();

        if (result.success) {
            alert("🎉 Transaction Successful! You are now a premium user.");
            window.location.reload(); // ✅ Refresh to show updated premium status
        } else {
            alert("❌ Transaction Failed.");
        }
    } catch (error) {
        console.error("❌ Error verifying payment:", error);
        alert("Something went wrong while verifying payment.");
    }
}
