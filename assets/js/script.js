let menu = document.querySelector('.menu-icon');
let slider = document.querySelector('.slider');
let icon = document.querySelectorAll('.slider a');
menu.onclick = () => {
    slider.classList.toggle('active');
}

icon.forEach(icons => {
    icons.onclick = () => {
        slider.classList.toggle('active');
    }
});


document.getElementById('rzp-button').addEventListener('click', function () {
    var options = {
        "key": "YOUR_RAZORPAY_KEY_ID", // Replace with your Key ID from Razorpay Dashboard
        "amount": 50000, // Amount in paise (50000 = ₹500)
        "currency": "INR",
        "name": "Mine The Tech",
        "description": "Payment for Portfolio Service",
        "image": "your-logo.png", // Optional, replace with your logo URL
        "handler": function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            // Here, you can send the payment details to your backend for verification
        },
        "prefill": {
            "name": "Your Name",
            "email": "your@email.com",
            "contact": "9999999999"
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp = new Razorpay(options);
    rzp.open();
});
