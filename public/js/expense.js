document.addEventListener("DOMContentLoaded", async () => {
    const expenseForm = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expense-list"); // Ensure correct ID
    const buyMembershipBtn = document.getElementById("buyMembershipBtn");
    const premiumText = document.getElementById("premiumText");
    const leaderboardBtn = document.getElementById("leaderboardBtn");

    // ✅ Debugging: Check if elements are being selected
    console.log("Expense Form:", expenseForm);
    console.log("Expense List:", expenseList);
    console.log("Buy Membership Button:", buyMembershipBtn);
    console.log("Premium Text:", premiumText);
    console.log("Leaderboard Button:", leaderboardBtn);

    // ✅ Fetch existing expenses on load
    try {
        const response = await fetch("/expense/getAll");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const expenses = await response.json();

        if (expenses.length === 0) {
            expenseList.innerHTML = "<li>No expenses found.</li>"; // Show message if empty
        } else {
            expenseList.innerHTML = ""; // Clear existing list
            expenses.forEach(exp => {
                addExpenseToList(exp);
            });
        }
    } catch (error) {
        console.error("❌ Error fetching expenses:", error);
        expenseList.innerHTML = "<li>Error loading expenses.</li>"; // Display error to user
    }

    // ✅ Handle form submission properly
    expenseForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // ✅ Prevent default form submission (fixes page refresh)

        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;

        try {
            const response = await fetch("/expense/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, description, category })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (response.status === 201) {
                alert("✅ Expense added successfully!"); // ✅ Provide user feedback
                location.reload(); // ✅ Refresh page to show new expense
                // Optionally, you could clear the form fields instead of reloading:
                // document.getElementById("amount").value = "";
                // document.getElementById("description").value = "";
                // document.getElementById("category").value = "food"; // Reset to default
            } else {
                alert("❌ Error adding expense: " + data.message);
            }
        } catch (error) {
            console.error("❌ Error adding expense:", error);
            alert("❌ Error adding expense: " + error.message);
        }
    });

    // Function to add expense to list
    function addExpenseToList(exp) {
        const li = document.createElement("li");
        li.innerHTML = `${exp.amount} - ${exp.description} (${exp.category}) 
                      <button class="delete-expense" data-id="${exp.id}">Delete</button>`;
        expenseList.appendChild(li);
    }

    // ✅ Handle delete button clicks (event delegation)
    expenseList.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-expense")) {
            const expenseId = event.target.dataset.id;
            try {
                const response = await fetch(`/expense/delete/${expenseId}`, {
                    method: "DELETE"
                });
                if (response.ok) {
                    alert("✅ Expense deleted successfully!");
                    event.target.parentElement.remove(); // Remove from the UI
                } else {
                    const data = await response.json();
                    alert("❌ Error deleting expense: " + data.message);
                }
            } catch (error) {
                console.error("❌ Error deleting expense:", error);
                alert("❌ Error deleting expense: " + error.message);
            }
        }
    });

    // ✅ Debugging: Check if button exists
    if (!buyMembershipBtn) {
        console.warn("❌ Buy Membership button not found!");
    }
    if (!leaderboardBtn) {
        console.warn("❌ Leaderboard button not found!");
    }
    console.log("✅ Buy Membership button found!");
    console.log("✅ leaderboard button found!");

    // ✅ Check if user is logged in
    try {
        const res = await fetch("/user/session");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const userId = data.userId;

        if (!userId) {
            alert("Error: User ID not found. Please log in again.");
            window.location.href = "signup.html";
            return;
        }

        // ✅ Fetch user details to check if they are premium
        const userRes = await fetch("/user/details");
        if (!userRes.ok) {
            throw new Error(`HTTP error! status: ${userRes.status}`);
        }
        const userData = await userRes.json();

        console.log("✅ User Data:", userData); // Add this line
        console.log("✅ isPremium:", userData.isPremium); // Add this line
        console.log("✅ Type of isPremium", typeof userData.isPremium)

        if (userData.isPremium === 1 || userData.isPremium === true) {
            buyMembershipBtn.style.display = "none";
            premiumText.style.display = "block";
            if (leaderboardBtn) { // Check if leaderboardBtn exists before setting style
                leaderboardBtn.style.display = "block";
            } else {
                console.warn("⚠️ Leaderboard button not found, cannot set display style.");
            }
        } else {
            buyMembershipBtn.style.display = "block";
            premiumText.style.display = "none";
            if (leaderboardBtn) { // Check if leaderboardBtn exists before setting style
                leaderboardBtn.style.display = "none";
            } else {
                console.warn("⚠️ Leaderboard button not found, cannot set display style.");
            }
        }
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        alert("❌ Failed to check user status. Please try again.");
        return;
    }
    // ✅ Handle "Buy Membership" Button Click
    buyMembershipBtn.addEventListener("click", async () => {
        console.log("✅ Buy Membership button clicked!");

        try {
            const response = await fetch("/purchase/membership", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            console.log("✅ Fetch request sent to /purchase/membership");

            const data = await response.json();

            if (!data.orderId) {
                console.error("❌ Failed to create order. Response:", data);
                alert("Error: Unable to create order. Check console.");
                return;
            }

            console.log("✅ Order created successfully!", data);

            const options = {
                key: "rzp_test_cNdwDn00jRSuoN",
                amount: 3000,
                currency: "INR",
                name: "Expense Tracker Premium",
                order_id: data.orderId,
                handler: async function (response) {
                    console.log("✅ Payment successful:", response);
                    await verifyPayment(response, data.orderId);
                },
                prefill: {
                    email: localStorage.getItem("userEmail"),
                }
            };

            const razorpay = new Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("❌ Error in buy membership:", error);
            alert("Something went wrong while processing payment.");
        }
    });

    async function verifyPayment(response, orderId) {
        try {
            console.log("✅ Verifying payment...", response);

            const res = await fetch("/purchase/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                })
            });

            const result = await res.json();
            console.log("✅ Payment verification response:", result);

            if (result.success) {
                alert("🎉 Transaction Successful! You are now a premium member.");
                window.location.reload(); // ✅ Refresh to show updated premium status
            } else {
                alert("❌ Transaction Failed.");
            }
        } catch (error) {
            console.error("❌ Error verifying payment:", error);
            alert("Something went wrong while verifying payment.");
        }
    }

    // ✅ Function to toggle leaderboard visibility and fetch data
    window.toggleLeaderboard = async function() {
        const leaderboardContainer = document.getElementById("leaderboardContainer");
        const leaderboardTable = document.getElementById("leaderboard");

        if (leaderboardContainer.style.display === "none") {
            leaderboardContainer.style.display = "block";

            // Fetch leaderboard data
            try {
                const response = await fetch("/expense/leaderboard");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const leaderboardData = await response.json();

                // Populate the leaderboard table
                leaderboardTable.innerHTML = ""; // Clear existing data
                leaderboardData.forEach((user, index) => {
                    const row = leaderboardTable.insertRow();
                    const rankCell = row.insertCell();
                    const nameCell = row.insertCell();
                    const expenseCell = row.insertCell();

                    rankCell.textContent = index + 1;
                    nameCell.textContent = user.name;
                    expenseCell.textContent = user.total_expense;
                });
            } catch (error) {
                console.error("❌ Error fetching leaderboard:", error);
                alert("❌ Failed to fetch leaderboard data.");
                leaderboardContainer.style.display = "none"; // Hide on error
            }
        } else {
            leaderboardContainer.style.display = "none";
        }
    };
});