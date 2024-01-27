const firebaseConfig = {
    apiKey: "AIzaSyB6xMZMq7Li1zHQPvakuvosWoZTm9k98vc",
    authDomain: "nav-angeles-thesis.firebaseapp.com",
    projectId: "nav-angeles-thesis",
    storageBucket: "nav-angeles-thesis.appspot.com",
    messagingSenderId: "962685227322",
    appId: "1:962685227322:web:0d600e148a9b396f444003",
    measurementId: "G-Z2YH23D6EV",
    databaseURL: "https://nav-angeles-thesis-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to form elements
const registrationForm = document.getElementById("registration-form");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const registerButton = document.getElementById("register-button");

// Add a click event listener to the Register button
registerButton.addEventListener("click", function () {
    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Register the user with Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Registration successful
            const user = userCredential.user;
            alert("Registration successful for " + user.email);

            // Create a custom node for the admin in the Realtime Database
            const adminData = {
                fullName: fullName,
                email: email,
                isAdmin: true, // You can set custom properties, e.g., isAdmin
            };

            // Save the password (for demonstration purposes only)
            adminData.password = password;

            firebase.database().ref("Admins/" + user.uid).set(adminData)
                .then(() => {
                    // Node creation successful
                    alert("Admin node created in the database.");
                })
                .catch((error) => {
                    // Handle database errors
                    alert("Database error: " + error.message);
                });

            // You can add additional logic here, e.g., redirect to the admin dashboard
        })
        .catch((error) => {
            // Handle registration errors
            alert("Registration error: " + error.message);
        });
});

// Handle the "Already have an account?" link
document.querySelector("a[href='index.html']").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "index.html"; // Redirect to the login page
});
