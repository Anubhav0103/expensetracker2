document.addEventListener("DOMContentLoaded", async () => {
    const expenseForm = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expense-list");
    const buyMembershipBtn = document.getElementById("buyMembershipBtn");
    const premiumText = document.getElementById("premiumText");
    const leaderboardBtn = document.getElementById("leaderboardBtn");
    const paginationContainer = document.getElementById('pagination');

    let currentPage = 1; // Track current page
    let limit = getExpensesPerPage(); // Expenses per page

    // ✅ Debugging: Check if elements are being selected
    console.log("Expense Form:", expenseForm);
    console.log("Expense List:", expenseList);
    console.log("Buy Membership Button:", buyMembershipBtn);
    console.log("Premium Text:", premiumText);
    console.log("Leaderboard Button:", leaderboardBtn);

    // Function to determine the number of expenses per page based on screen width
    function getExpensesPerPage() {
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let limitValue;

        if (screenWidth <= 768) {
            limitValue = 5;
        } else if (screenWidth <= 1200) {
            limitValue = 10;
        } else {
            limitValue = 16;
        }

        console.log("Screen width:", screenWidth, "Expenses per page:", limitValue);
        return limitValue;
    }

   window.addEventListener('resize', () => {
        console.log('Window was resized');
        limit = getExpensesPerPage(); // Update limit
        currentPage = 1; // Reset to first page
        fetchExpenses(currentPage); // Reload expenses with new settings
    });
    // ✅ Function to fetch and display expenses with pagination
     async function fetchExpenses(page) {
        try {
            limit = getExpensesPerPage();
            console.log('Fetching expenses for page:', page, 'with limit:', limit);

            const response = await fetch(`/expense/getAll?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const expenses = data.expenses;
            console.log('Received expenses:', expenses);

            expenseList.innerHTML = ""; // Clear existing list
            if (expenses.length === 0) {
                expenseList.innerHTML = "<li>No expenses found.</li>";
            } else {
                expenses.forEach(exp => {
                    addExpenseToList(exp);
                });
            }

            displayPagination(data.page, data.totalPages);
        } catch (error) {
            console.error("❌❌❌ Error fetching expenses:", error);
            expenseList.innerHTML = "<li>Error loading expenses.</li>"; // Display error to user
        }
    }

    // ✅ Initial expenses fetch
    fetchExpenses(currentPage);

    // ✅ Function to display pagination controls
     // ✅ Function to display pagination controls with limited page numbers
     function displayPagination(currentPage, totalPages) {
        paginationContainer.innerHTML = ''; // Clear existing buttons
        if (totalPages <= 1) return; // No pagination needed if only 1 page
    
        // Add "Previous" button if not on the first page
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => fetchExpenses(currentPage - 1));
            paginationContainer.appendChild(prevButton);
        }
    
        // Always show first page
        const firstPage = document.createElement('button');
        firstPage.textContent = '1';
        firstPage.addEventListener('click', () => fetchExpenses(1));
        if (currentPage === 1) firstPage.disabled = true;
        paginationContainer.appendChild(firstPage);
    
        // Add "..." if there's a gap after page 1
        if (currentPage > 3) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    
        // Show previous page (if applicable)
        if (currentPage - 1 > 1) {
            const prevPage = document.createElement('button');
            prevPage.textContent = currentPage - 1;
            prevPage.addEventListener('click', () => fetchExpenses(currentPage - 1));
            paginationContainer.appendChild(prevPage);
        }
    
        // Show current page (if not first or last)
        if (currentPage !== 1 && currentPage !== totalPages) {
            const currentPageBtn = document.createElement('button');
            currentPageBtn.textContent = currentPage;
            currentPageBtn.disabled = true;
            paginationContainer.appendChild(currentPageBtn);
        }
    
        // Show next page (if applicable)
        if (currentPage + 1 < totalPages) {
            const nextPage = document.createElement('button');
            nextPage.textContent = currentPage + 1;
            nextPage.addEventListener('click', () => fetchExpenses(currentPage + 1));
            paginationContainer.appendChild(nextPage);
        }
    
        // Add "..." if there's a gap before the last page
        if (currentPage < totalPages - 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    
        // Always show last page if more than 1 page
        if (totalPages > 1) {
            const lastPage = document.createElement('button');
            lastPage.textContent = totalPages;
            lastPage.addEventListener('click', () => fetchExpenses(totalPages));
            if (currentPage === totalPages) lastPage.disabled = true;
            paginationContainer.appendChild(lastPage);
        }
    
        // Add "Next" button if not on the last page
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => fetchExpenses(currentPage + 1));
            paginationContainer.appendChild(nextButton);
        }
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
                fetchExpenses(currentPage); // Refresh expenses to update pagination
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
                    fetchExpenses(currentPage); // Refresh expenses to update pagination
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
                console.warn("⚠️ Leaderboard button not found!");
            }
        } else {
            buyMembershipBtn.style.display = "block";
            premiumText.style.display = "none";
            if (leaderboardBtn) { // Check if leaderboardBtn exists before setting style
                leaderboardBtn.style.display = "none";
            } else {
                console.warn("⚠️ Leaderboard button not found!");
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
                    razorpay_order_id: response.razorpay_payment_id,
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
                    throw new Error(`HTTP error! status: ${res.status}`);
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
    }
});