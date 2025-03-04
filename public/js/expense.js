document.addEventListener("DOMContentLoaded", async () => {
    const buyMembershipBtn = document.getElementById("buyMembership");
    const premiumText = document.getElementById("premiumText");

    if (!buyMembershipBtn) {
        console.error("❌ Buy Membership button not found!");
        return;
    }

    console.log("✅ Buy Membership button found!");

    const res = await fetch("/user/session");
    const data = await res.json();
    const userId = data.userId;

    if (!userId) {
        alert("Error: User ID not found. Please log in again.");
        window.location.href = "signup.html";
        return;
    }

    const userRes = await fetch("/user/details");
    const userData = await userRes.json();

    if (userData.isPremium) {
        buyMembershipBtn.style.display = "none";
        premiumText.style.display = "block";
    }

    document.getElementById("buyMembership").addEventListener("click", async () => {
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
                window.location.reload();
            } else {
                alert("❌ Transaction Failed.");
            }
        } catch (error) {
            console.error("❌ Error verifying payment:", error);
            alert("Something went wrong while verifying payment.");
        }
    }
});
