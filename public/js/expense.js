document.addEventListener('DOMContentLoaded', async function () {
    console.log("✅ Expense page loaded!");

    // Elements
    const buyMembershipBtn = document.getElementById('buyMembershipBtn');
    const premiumText = document.getElementById('premiumText');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    const leaderboardTable = document.getElementById('leaderboard');
    const expenseList = document.getElementById('expenseList');

    // Check user details
    try {
        const userDetails = await fetch('/user/details').then(res => res.json());

        if (userDetails.isPremium) {
            buyMembershipBtn.style.display = 'none'; // Hide Buy Membership Button
            premiumText.style.display = 'block'; // Show "You are a Premium Member"
            leaderboardBtn.style.display = 'inline-block'; // Show Leaderboard Button
        } else {
            buyMembershipBtn.style.display = 'inline-block';
        }
    } catch (error) {
        console.error("❌ Error fetching user details:", error);
    }

    // Toggle Leaderboard
    leaderboardBtn.addEventListener('click', async function () {
        if (leaderboardContainer.style.display === 'none') {
            leaderboardContainer.style.display = 'block';
            leaderboardBtn.textContent = '📉 Hide Leaderboard';
            loadLeaderboard();
        } else {
            leaderboardContainer.style.display = 'none';
            leaderboardBtn.textContent = '📊 Show Leaderboard';
        }
    });

    async function loadLeaderboard() {
        try {
            const res = await fetch('/expense/leaderboard');
            const data = await res.json();

            leaderboardTable.innerHTML = ""; // Clear previous data
            data.forEach((user, index) => {
                const row = `<tr>
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>₹${user.total_expense}</td>
                </tr>`;
                leaderboardTable.innerHTML += row;
            });
        } catch (error) {
            console.error("❌ Error loading leaderboard:", error);
        }
    }

    // Fetch and display expenses
    async function loadExpenses() {
        try {
            const response = await fetch('/expense/getAll');
            const expenses = await response.json();
            expenseList.innerHTML = "";
            expenses.forEach(exp => {
                const li = document.createElement('li');
                li.textContent = `${exp.description} - ₹${exp.amount} (${exp.category})`;
                expenseList.appendChild(li);
            });
        } catch (error) {
            console.error("❌ Error fetching expenses:", error);
        }
    }
    loadExpenses();
});
