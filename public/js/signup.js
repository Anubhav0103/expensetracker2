document.addEventListener('DOMContentLoaded', function () {
    let signupForm = document.getElementById('signupForm');
    let loginForm = document.getElementById('loginForm');

    // ✅ Signup Form Submission
    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.status === 400) {
                alert("⚠️ User already exists! Try logging in.");
            } else if (response.status === 201) {
                alert("✅ Signup successful! You can now log in.");
            } else {
                alert("❌ Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error in signup:", error);
            alert("❌ Server error. Please try again later.");
        }
    });

    // ✅ Login Form Submission
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.status === 404) {
                alert("⚠️ User not found! Please sign up first.");
            } else if (response.status === 401) {
                alert("❌ Incorrect password. Please try again.");
            } else if (response.status === 200) {
                alert("Login successful, redirecting...");
                window.location.href = "/expense.html";  // ✅ Redirect to expense page

            } else {
                alert("❌ Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error in login:", error);
            alert("❌ Server error. Please try again later.");
        }
    });
});
