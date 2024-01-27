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

function signInAdmin() {
    const emailInput = document.getElementById("admin-email").value;
    const passwordInput = document.getElementById("admin-password").value;

    // Sign in the admin user using Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
        .then((userCredential) => {
            // Successfully signed in as admin
            const user = userCredential.user;
            console.log("Admin user signed in: " + user.email);

            // Redirect to the home page
            window.location.href = "home.html"; // Replace with your home page URL
        })
        .catch((error) => {
            // Handle sign-in errors
            console.error("Admin sign-in error: " + error.message);
        });
}

// Add an event listener for the login button
document.getElementById("admin-login-button").addEventListener("click", signInAdmin);
  
