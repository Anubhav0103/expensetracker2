document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        alert(data.message);  // Shows ❌ Login failed if user is not found

        if (res.ok) {
            window.location.href = "/expense.html";  // Redirect on successful login
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("⚠️ Something went wrong. Try again later.");
    }
});
