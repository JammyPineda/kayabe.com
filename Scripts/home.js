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

firebase.initializeApp(firebaseConfig);

const barChartData = {
    labels: [],
    data: [],
    backgroundColor: []
};
const touristSpotBarChartData = {
    labels: [],
    data: [],
    backgroundColor: []
};

document.addEventListener("DOMContentLoaded", function () {

    const currentYear = new Date().getFullYear();
    const startingYear = 2022;
    const select = document.getElementById("years");

    for (let year = startingYear; year <= currentYear; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.text = year;
        select.appendChild(option);
    }

    const monthNumberMap = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12,
    };

    // Reference to the Firebase Realtime Database
    let database = firebase.database();

    // Reference to the "feedback" node in the database
    const feedbackRef = database.ref("feedback");

    // Reference to the "SelectedPlaces" node in the database
    const selectedPlacesRef = database.ref("SelectedPlaces");

    // Reference to the "Fare" node in the database
    const fareRef = database.ref("Fare");

    // Reference to the "Customers" node in the database
    const customersRef = database.ref("Users/Customers");

    // Reference to the "Tourist Spots" node in the database
    const touristSpotsRef = database.ref("Tourist Spots");

    const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

     // Add event listener for year change
     updateTableOnYearChange();

     // Call the function to display data when the page loads
     displayMonthlyYearlyVisits();


    const pieChartData = {
        labels: [],
        data: [],
        backgroundColor: []
    };

    const ctxBar = document.getElementById("searchPieChart").getContext("2d");
    let searchBarChart;

    const searchBarChartOptions = {
        type: "bar",
        data: {
            labels: barChartData.labels,
            datasets: [
                {
                    label: "Search Count",
                    data: barChartData.data,
                    backgroundColor: barChartData.backgroundColor,
                },
            ],
        },
        options: {
            responsive: true, // Set to true for responsiveness
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    };
        
    searchBarChart = new Chart(ctxBar, searchBarChartOptions);

    const touristSpotBarChartOptions = {
        type: "bar",
        data: {
            labels: touristSpotBarChartData.labels,
            datasets: [
                {
                    label: "Tourist Spot Search Count",
                    data: touristSpotBarChartData.data,
                    backgroundColor: touristSpotBarChartData.backgroundColor,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    };
    
    // Create the tourist spot bar chart
    let touristSpotBarChart;
    
    function generateRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    // Add event listeners for menu items
    document.getElementById("fares").addEventListener("click", function () {
        // Hide all content areas
        hideAllContent();
    
        // Show the Fares content
        document.getElementById("fares-content").style.display = "block";
    
        // Highlight the active menu item
        setActiveMenuItem(this);
    });

document.getElementById("terminals").addEventListener("click", function () {
    // Hide all content areas
    hideAllContent();

    // Show the Terminal content
    document.getElementById("terminals-content").style.display = "block";

    // Call the function to display terminals
    displayTerminals();

    // Highlight the active menu item
    setActiveMenuItem(this);
});

document.getElementById("reports").addEventListener("click", function () {
    // Hide all content areas
    hideAllContent();

    // Show the Reports content
    document.getElementById("reports-content").style.display = "block";

    // Display feedback from the database
    displayFeedback();

    // Highlight the active menu item
    setActiveMenuItem(this);
});

document.getElementById("searched-places").addEventListener("click", function () {
    // Hide all content areas
    hideAllContent();

    // Show the Most Searched Place content
    document.getElementById("searched-places-content").style.display = "block";

    // Display most searched places
    displayMostSearchedPlaces();

    // Highlight the active menu item
    setActiveMenuItem(this);
});

document.getElementById("registered-users").addEventListener("click", function () {
    // Hide all content areas
    hideAllContent();

    // Show the Registered Users content
    document.getElementById("registered-users-content").style.display = "block";

    // Call the function to display registered users
    displayRegisteredUsers();

    // Highlight the active menu item
    setActiveMenuItem(this);
});

document.getElementById("monthly-yearly-visits").addEventListener("click", function () {
    // Hide all content areas
    hideAllContent();

    // Show the Monthly/Yearly Visits content
    document.getElementById("monthly-yearly-visits-content").style.display = "block";

    // Highlight the active menu item
    setActiveMenuItem(this);
});


document.getElementById("months").addEventListener("change", function(){

     year = document.getElementById('years').value;
     month = document.getElementById('months').value;

        console.log(month);
     fetchAndProcessTouristSpotDataFilter(months, years);
});

function formatDate(date) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(2);
  
    return `${day} ${month} ${year}`;
  }

function fetchAndProcessTouristSpotDataFilter(startDate, endDate) {
        // ...
    
        // Set up a listener to monitor changes in the "Tourist Spots" node
        touristSpotsRef.orderByChild("year").
        equalTo(startDate).
        once("value", (spotSnapshot) => {
            const spotData = spotSnapshot.val();
            console.log(spotData);
            const spotName = spotData.name;
    
            // Update the bar chart data
            touristSpotBarChartData.labels.push(spotName);
            touristSpotBarChartData.data.push(); // You can change this if you have additional information to count
            touristSpotBarChartData.backgroundColor.push(generateRandomColor());
    
            // Update the bar chart
            updateTouristSpotBarChart(touristSpotBarChartData, startDate, endDate);
        });
    
        // Set up a listener to handle the initial data load
        // touristSpotsRef.orderByChild("timestamp").
        // startAt(startDate).
        // endAt(endDate).
        //     once("value", (snapshot) => {
        //     const spotData = snapshot.val();
        //     const spotName = spotData.name;
        //     // Call the function to update the bar chart
        //     touristSpotBarChartData.labels.push(spotName);
        //     touristSpotBarChartData.data.push(1); // You can change this if you have additional information to count
        //     touristSpotBarChartData.backgroundColor.push(generateRandomColor());
        //     updateTouristSpotBarChart(touristSpotBarChartData, startDate, endDate);
        // });
    }

function hideAllContent() {
    // Hide all content areas
    document.getElementById("fares-content").style.display = "none";
    document.getElementById("terminals-content").style.display = "none";
    document.getElementById("reports-content").style.display = "none";
    document.getElementById("searched-places-content").style.display = "none";
    document.getElementById("registered-users-content").style.display = "none";
    document.getElementById("monthly-yearly-visits-content").style.display = "none";
}

function setActiveMenuItem(clickedItem) {
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => item.classList.remove("active"));

    // Add active class to the clicked menu item
    clickedItem.classList.add("active");
}

       
    // fetchAndProcessTouristSpotData();

    function aggregateSearchCount(labels, data) {
        const aggregatedData = {
            labels: [],
            data: [],
            backgroundColor: [],
        };
    
        const spotCount = {};
    
        // Aggregate search count for each spot
        for (let i = 0; i < labels.length; i++) {
            const spotName = labels[i];
            const count = data[i];
    
            if (spotCount.hasOwnProperty(spotName)) {
                spotCount[spotName] += count;
            } else {
                spotCount[spotName] = count;
            }
        }
    
        // Update aggregatedData with aggregated search count
        for (const spotName in spotCount) {
            if (spotCount.hasOwnProperty(spotName)) {
                aggregatedData.labels.push(spotName);
                aggregatedData.data.push(spotCount[spotName]);
                aggregatedData.backgroundColor.push(generateRandomColor());
            }
        }
    
        return aggregatedData;
    }
    
    function fetchAndProcessTouristSpotData() {
        // ...
    
        // Set up a listener to monitor changes in the "Tourist Spots" node
        touristSpotsRef.on("child_added", (spotSnapshot) => {
            const spotData = spotSnapshot.val();
            const spotName = spotData.name;
    
            // Update the bar chart data
            touristSpotBarChartData.labels.push(spotName);
            touristSpotBarChartData.data.push(1); // You can change this if you have additional information to count
            touristSpotBarChartData.backgroundColor.push(generateRandomColor());
    
            // Update the bar chart
            updateTouristSpotBarChart(touristSpotBarChartData);
        });
    
        // Set up a listener to handle the initial data load
        touristSpotsRef.once("value", (snapshot) => {
            // Call the function to update the bar chart
            updateTouristSpotBarChart(touristSpotBarChartData);
        });
    }
    
    // Call the function to fetch and display tourist spot data
    fetchAndProcessTouristSpotData();
   
  

    function aggregateSearchCount(labels, data) {
        const aggregatedData = {
            labels: [],
            data: [],
            backgroundColor: [],
        };
    
        const spotCount = {};
    
        // Aggregate search count for each spot
        for (let i = 0; i < labels.length; i++) {
            const spotName = labels[i];
            const count = data[i];
    
            if (spotCount.hasOwnProperty(spotName)) {
                spotCount[spotName] += count;
            } else {
                spotCount[spotName] = count;
            }
        }
    
        // Update aggregatedData with aggregated search count
        for (const spotName in spotCount) {
            if (spotCount.hasOwnProperty(spotName)) {
                aggregatedData.labels.push(spotName);
                aggregatedData.data.push(spotCount[spotName]);
                aggregatedData.backgroundColor.push(generateRandomColor());
            }
        }
    
        return aggregatedData;
    }
    
    // function fetchAndProcessTouristSpotData() {
    //     // ...
    
    //     // Set up a listener to monitor changes in the "Tourist Spots" node
    //     touristSpotsRef.on("child_added", (spotSnapshot) => {
    //         const spotData = spotSnapshot.val();
    //         const spotName = spotData.name;
    
    //         // Update the bar chart data
    //         touristSpotBarChartData.labels.push(spotName);
    //         touristSpotBarChartData.data.push(1); // You can change this if you have additional information to count
    //         touristSpotBarChartData.backgroundColor.push(generateRandomColor());
    
    //         // Update the bar chart
    //         updateTouristSpotBarChart(touristSpotBarChartData);
    //     });
    
    //     // Set up a listener to handle the initial data load
    //     touristSpotsRef.once("value", (snapshot) => {
    //         // Call the function to update the bar chart
    //         updateTouristSpotBarChart(touristSpotBarChartData);
    //     });
    // }
    
    // // Call the function to fetch and display tourist spot data
    // fetchAndProcessTouristSpotData();


    function updateTouristSpotBarChart(touristSpotBarChartData) {
        // Clear existing bar chart data
        if (touristSpotBarChartData.labels.length === 0) {
            return; // No data to update
        }
    
        const aggregatedData = aggregateSearchCount(touristSpotBarChartData.labels, touristSpotBarChartData.data);
    
        // Randomize colors for the bar chart
        const backgroundColors = Array.from({ length: aggregatedData.labels.length }, () => generateRandomColor());
    
        // Create or update the bar chart
        if (touristSpotBarChart) {
            touristSpotBarChart.data.labels = aggregatedData.labels;
            touristSpotBarChart.data.datasets[0].data = aggregatedData.data;
            touristSpotBarChart.data.datasets[0].backgroundColor = backgroundColors;
            touristSpotBarChart.update();
        } else {
            // Create the bar chart directly
            const ctxTouristSpotBar = document.getElementById("touristSpotBarChart").getContext("2d");
            touristSpotBarChart = new Chart(ctxTouristSpotBar, {
                type: "bar",
                data: {
                    labels: aggregatedData.labels,
                    datasets: [
                        {
                            label: "Tourist Spot Search Count",
                            data: aggregatedData.data,
                            backgroundColor: backgroundColors,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }
    
    // fetchAndProcessTouristSpotData();

    function aggregateSearchCount(labels, data) {
        const aggregatedData = {
            labels: [],
            data: [],
            backgroundColor: [],
        };
    
        const spotCount = {};
    
        // Aggregate search count for each spot
        for (let i = 0; i < labels.length; i++) {
            const spotName = labels[i];
            const count = data[i];
    
            if (spotCount.hasOwnProperty(spotName)) {
                spotCount[spotName] += count;
            } else {
                spotCount[spotName] = count;
            }
        }
    
        // Update aggregatedData with aggregated search count
        for (const spotName in spotCount) {
            if (spotCount.hasOwnProperty(spotName)) {
                aggregatedData.labels.push(spotName);
                aggregatedData.data.push(spotCount[spotName]);
                aggregatedData.backgroundColor.push(generateRandomColor());
            }
        }
    
        return aggregatedData;
    }
    
    // function fetchAndProcessTouristSpotData() {
    //     // ...
    
    //     // Set up a listener to monitor changes in the "Tourist Spots" node
    //     touristSpotsRef.on("child_added", (spotSnapshot) => {
    //         const spotData = spotSnapshot.val();
    //         const spotName = spotData.name;
    
    //         // Update the bar chart data
    //         touristSpotBarChartData.labels.push(spotName);
    //         touristSpotBarChartData.data.push(1); // You can change this if you have additional information to count
    //         touristSpotBarChartData.backgroundColor.push(generateRandomColor());
    
    //         // Update the bar chart
    //         updateTouristSpotBarChart(touristSpotBarChartData);
    //     });
    
    //     // Set up a listener to handle the initial data load
    //     touristSpotsRef.once("value", (snapshot) => {
    //         // Call the function to update the bar chart
    //         updateTouristSpotBarChart(touristSpotBarChartData);
    //     });
    // }
    
    // // Call the function to fetch and display tourist spot data
    // fetchAndProcessTouristSpotData();


    function displayFeedback() {
        const feedbackList = document.getElementById("feedback-list");
        const filterInput = document.getElementById("filter-feedback");
        const filterRating = document.getElementById("filter-rating").value;
    
        // Clear existing feedback
        feedbackList.innerHTML = "";
    
        // Fetch and display feedback data
        feedbackRef.on("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const feedback = childSnapshot.val();
                const feedbackContainer = document.createElement("div");
                feedbackContainer.className = "feedback-container";
    
                // Convert numerical rating to star icons
                const starRating = Array.from({ length: feedback.rating }, (_, index) => {
                    return `<i class="fas fa-star"></i>`;
                }).join('');
    
                // Filter feedback based on the user input and selected rating
                const feedbackText = feedback.feedbackText.toLowerCase();
                const filterValue = filterInput.value.toLowerCase();
                const ratingMatches = filterRating === "" || feedback.rating.toString() === filterRating;
                if (feedbackText.includes(filterValue) && ratingMatches) {
                    feedbackContainer.innerHTML = `<strong>User Rating:</strong> <span class="star-rating">${starRating}</span><br>${feedback.feedbackText}`;
                    feedbackList.appendChild(feedbackContainer);
                }
            });
        });
    }
    
    // Add event listeners for the filter inputs
    document.getElementById("filter-feedback").addEventListener("input", displayFeedback);
    document.getElementById("filter-rating").addEventListener("change", displayFeedback);
    

    // Function to display most searched places as percentages
    function displayMostSearchedPlaces(month, year) {

        const mostSearchedPlacesContent = document.getElementById("most-searched-places-content");
    
        // Clear existing content
        mostSearchedPlacesContent.innerHTML = "";
    
        // Create an object to store the count of each place
        const placeCount = {};
    
        // Set up a listener to monitor changes in the "SelectedPlaces" node
        selectedPlacesRef.orderByChild("month").equalTo(month).on("child_added", (placeSnapshot) => {
            const placeData = placeSnapshot.val();
            if(placeData.year === year){
    
                const placeName = placeData.name;
    
                placeCount[placeName] = (placeCount[placeName] || 0) + 1;
    
                updateDisplayedPlaces(mostSearchedPlacesContent, placeCount);
    
                updateBarChart(placeCount);
                document.getElementById('emptyPlaces').innerHTML = "";
    
            }
            else{
                document.getElementById('emptyPlaces').innerHTML = "No Data Found!";
            }
        })
    }
    document.getElementById("apply-filter-button").addEventListener('click', () => {
        const Month = document.getElementById('months');
        const Year = document.getElementById('years');
    
        displayMostSearchedPlaces(Month.value,Year.value);
    
    });


// Define the updateDisplayedPlaces function first
function updateDisplayedPlaces(container, placeCount) {
    // No need to display places in the most searched places content

    // Now, call the function to update the bar chart
    updateBarChart(placeCount);
}

// Now define the displayMostSearchedPlaces function

const touristSpotNamesContent = document.getElementById("tourist-spot-names-content");

function displayTouristSpotNames() {
    // Reference to the "Tourist Spots" node in the database
    const touristSpotsRef = firebase.database().ref("Tourist Spots");

    // Fetch data from the "Tourist Spots" node
    touristSpotsRef.once("value")
        .then((snapshot) => {
            // Create an object to store the count of each spot
            const spotCount = {};

            // Iterate through each unique key
            snapshot.forEach((spotSnapshot) => {
                // Get the value of the 'name' child under each unique key
                const nameValue = spotSnapshot.child("name").val();

                // Update the count for each spot
                spotCount[nameValue] = (spotCount[nameValue] || 0) + 1;
            });

            // Now, call the function to update the bar chart
            updateBarChart(spotCount);
        })
        .catch((error) => {
            console.error("Error fetching tourist spot names:", error);
        });
}


displayTouristSpotNames();

function updateBarChart(placeCount) {
    // Clear existing bar chart data
    barChartData.labels = [];
    barChartData.data = [];
    barChartData.backgroundColor = [];

    // Iterate over placeCount data and update barChartData
    for (const place in placeCount) {
        barChartData.labels.push(place);
        barChartData.data.push(placeCount[place]);
        barChartData.backgroundColor.push(generateRandomColor());
    }

    // Create or update the bar chart
    if (searchBarChart) {
        searchBarChart.data.labels = barChartData.labels;
        searchBarChart.data.datasets[0].data = barChartData.data;
        searchBarChart.data.datasets[0].backgroundColor = barChartData.backgroundColor;
        searchBarChart.update();
    } else {
        // Create the bar chart directly
        searchBarChart = new Chart(ctxBar, searchBarChartOptions);
    }
}

function generateRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}


function displayFares() {
    const faresTable = document.getElementById("fares-table");

    // Clear existing rows
    while (faresTable.rows.length > 1) {
        faresTable.deleteRow(1);
    }

    // Set up a listener to monitor changes in the "Fare" node
    fareRef.on("child_added", (fareSnapshot) => {
        const routeName = fareSnapshot.key;
        const fareData = fareSnapshot.val();
        const fareValue = fareData.price;

        // Insert a new row at the end of the table
        const fareRow = faresTable.insertRow(-1);

        // Populate the table cells
        const routeCell = fareRow.insertCell(0);
        routeCell.textContent = routeName;

        const fareCell = fareRow.insertCell(1);
        fareCell.innerHTML = `<span id="${routeName}-fare">${fareValue}</span>`;
    });
}



// Initialize the page by displaying fares
displayFares();

// Set up the global edit input, save button, and edit button
const inputElement = document.getElementById("global-edit-input");
const saveButton = document.getElementById("global-edit-save-button");
const editButton = document.getElementById("edit-button");

inputElement.addEventListener("input", () => onInputChange());
saveButton.addEventListener("click", () => saveGlobalFare());

function onInputChange() {
    // Perform any validation or processing if needed
}

// Modify the updateAllFares function to return a Promise
function updateAllFares(newFareValue) {
    return new Promise((resolve, reject) => {
        // Reference to the "Fare" node in the database
        const faresRef = database.ref("Fare");

        // Create an array to store all update promises
        const updatePromises = [];

        // Iterate through all routes and update the fare
        faresRef.once("value", (snapshot) => {
            snapshot.forEach((fareSnapshot) => {
                const routeName = fareSnapshot.key;
                const updatePromise = faresRef.child(routeName).child("price").set(newFareValue);
                updatePromises.push(updatePromise);
            });

            // Wait for all update promises to resolve
            Promise.all(updatePromises)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
}

// Modify the saveGlobalFare function to handle the promise
function saveGlobalFare() {
    const newFareValue = parseFloat(inputElement.value);

    if (!isNaN(newFareValue)) {
        // Update all fares in the database and wait for it to complete
        updateAllFares(newFareValue)
            .then(() => {
                // Update all displayed fares after the database update is complete
                updateDisplayedFares(newFareValue);
                
                // Disable the input box, save button, and enable the edit button after saving
                inputElement.disabled = true;
                saveButton.disabled = true;
                editButton.disabled = false;
            })
            .catch((error) => {
                console.error("Error updating fares:", error);
                alert("Failed to update fares. Please try again.");
            });
    } else {
        alert("Please enter a valid number.");
    }
}



function updateDisplayedFares(newFareValue) {
    // Update all displayed fares
    const fareElements = document.querySelectorAll("#fares-table tr:not(:first-child)");

    fareElements.forEach((fareElement) => {
        const routeName = fareElement.cells[0].textContent;
        const fareSpan = fareElement.cells[1].querySelector("span");
        fareSpan.innerText = newFareValue;
    });
}

function enableGlobalEdit() {
    // Enable the input box and save button
    inputElement.disabled = false;
    saveButton.disabled = false;
    editButton.disabled = true; // Disable the edit button while editing

    // Set focus on the input box
    inputElement.focus();
}



// Set up the click event to enable global editing
document.getElementById("edit-button").addEventListener("click", () => enableGlobalEdit());




function displayTerminals() {
    const terminalsContainer = document.getElementById("terminals-table-container");

    // Clear existing content
    terminalsContainer.innerHTML = "";

    // Reference to the "Terminals" node in the database
    const terminalsRef = database.ref("Terminals");

    // Fetch and display terminal data
    terminalsRef.once("value", (snapshot) => {
        const table = document.createElement("table");
        table.className = "terminals-table";

        // Table header
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = "<th>Terminal</th><th>Longitude</th><th>Latitude</th><th>Action</th>";
        table.appendChild(headerRow);

        snapshot.forEach((terminalSnapshot) => {
            const terminalKey = terminalSnapshot.key;
            const terminalData = terminalSnapshot.val();

            const row = document.createElement("tr");
            row.className = "terminal-row";

            row.innerHTML = `
                <td>${terminalKey}</td>
                <td>
                    <input type="text" class="editable-value" id="longitude-${terminalKey}" value="${terminalData.longitude}" disabled>
                </td>
                <td>
                    <input type="text" class="editable-value" id="latitude-${terminalKey}" value="${terminalData.latitude}" disabled>
                </td>
                <td>
                    <button class="edit-terminal-button" id="edit-terminal-${terminalKey}">Edit</button>
                    <button class="save-terminal-button" id="save-terminal-${terminalKey}" style="display: none;">Save</button>
                </td>
            `;

            const editButton = row.querySelector(`#edit-terminal-${terminalKey}`);
            const saveButton = row.querySelector(`#save-terminal-${terminalKey}`);
            const longitudeInput = row.querySelector(`#longitude-${terminalKey}`);
            const latitudeInput = row.querySelector(`#latitude-${terminalKey}`);

            // Add event listener for the "Edit" button
            editButton.addEventListener("click", () => {
                // Enable textboxes
                longitudeInput.disabled = false;
                latitudeInput.disabled = false;

                // Toggle button visibility
                editButton.style.display = "none";
                saveButton.style.display = "inline";
            });

            // Add event listener for the "Save" button
            saveButton.addEventListener("click", () => {
                // Save changes to the database
                saveTerminalLocation(terminalKey);

                // Disable textboxes
                longitudeInput.disabled = true;
                latitudeInput.disabled = true;

                // Toggle button visibility
                editButton.style.display = "inline";
                saveButton.style.display = "none";
            });

            table.appendChild(row);
        });

        terminalsContainer.appendChild(table);
    });
}


function saveTerminalLocation(terminalKey) {
    const longitudeInput = document.getElementById(`longitude-${terminalKey}`);
    const latitudeInput = document.getElementById(`latitude-${terminalKey}`);

    // Parse values to floats, or set to 0 if not a valid number
    const newLongitude = parseFloat(longitudeInput.value) || 0;
    const newLatitude = parseFloat(latitudeInput.value) || 0;

    // Reference to the "Terminals" node in the database
    const terminalsRef = database.ref("Terminals");

    // Update the longitude and latitude values in the database
    terminalsRef.child(terminalKey).update({
        longitude: newLongitude,
        latitude: newLatitude,
    });
}


    function displayRegisteredUsers() {
        const registeredUsersContainer = document.getElementById("registered-users-container");
        const userCountElement = document.getElementById("user-count");
    
        // Clear existing content
        registeredUsersContainer.innerHTML = "";
    
        // Create an HTML table
        const userTable = document.createElement("table");
        userTable.className = "user-table";
    
        // Create table header
        const tableHeader = document.createElement("tr");
        tableHeader.innerHTML = `<th>Name</th><th>Email</th>`;
        userTable.appendChild(tableHeader);
    
        // Retrieve data from the "Users/Customers" node
        customersRef.once("value")
            .then((snapshot) => {
                let userCount = 0;
    
                snapshot.forEach((userSnapshot) => {
                    const userData = userSnapshot.val();
                    if (userData) {
                        userCount++;
                        const userEmail = userData.email;
                        const userName = userData.name;
                
                        // Create a table row for each user without displaying the password
                        const userRow = document.createElement("tr");
                        userRow.innerHTML = `<td>${userName}</td><td>${userEmail}</td>`;
                        userTable.appendChild(userRow);
                    }
                });
    
                userCountElement.textContent = `User Count: ${userCount}`;
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    
        // Append the table to the container
        registeredUsersContainer.appendChild(userTable);
    }
    
    function togglePasswordVisibility(userRow, show) {
        const passwordElement = userRow.querySelector(".hidden-password");
        passwordElement.style.display = show ? "inline" : "none";
    }


//FILTER
function updateSearchPieChart(pieChartData, selectedMonth, selectedYear) {
    pieChartData.labels = [];
    pieChartData.data = [];
    pieChartData.backgroundColor = [];

    selectedPlacesRef.once("value", (snapshot) => {
        snapshot.forEach((placeSnapshot) => {
            const placeData = placeSnapshot.val();
            const placeMonth = placeData.month;
            const placeYear = placeData.year;

            if (placeMonth === selectedMonth && placeYear === selectedYear) {
                const placeName = placeData.name;

                pieChartData.labels.push(placeName);
                pieChartData.data.push(1); 
                pieChartData.backgroundColor.push(generateRandomColor());
            }
        });

        console.log("Search pie chart data:", pieChartData);
        updateSearchPieChart(pieChartData);
    });
}
      

function updateTouristSpotBarChart(touristSpotBarChartData, selectedMonth, selectedYear) {
    console.log("Updating tourist spot bar chart with filters:", selectedMonth, selectedYear);

    if (touristSpotBarChartData.labels.length === 0) {
        console.log("No data to update in tourist spot bar chart.");
        return;
    }

    const aggregatedData = aggregateSearchCount(touristSpotBarChartData.labels, touristSpotBarChartData.data);

    const backgroundColors = Array.from({ length: aggregatedData.labels.length }, () => generateRandomColor());

    if (touristSpotBarChart) {
        console.log("Updating existing chart...");
        touristSpotBarChart.data.labels = aggregatedData.labels;
        touristSpotBarChart.data.datasets[0].data = aggregatedData.data;
        touristSpotBarChart.data.datasets[0].backgroundColor = backgroundColors;
        touristSpotBarChart.update();
    } else {
        console.log("Creating new chart...");
        const ctxTouristSpotBar = document.getElementById("touristSpotBarChart").getContext("2d");
        touristSpotBarChart = new Chart(ctxTouristSpotBar, {
            type: "bar",
            data: {
                labels: aggregatedData.labels,
                datasets: [
                    {
                        label: "Tourist Spot Search Count",
                        data: aggregatedData.data,
                        backgroundColor: backgroundColors,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    console.log("Tourist spot bar chart data:", aggregatedData);
}

function applyChartFilters() {
    const selectedMonth = document.getElementById("filter-month").value;
    const selectedYear = document.getElementById("filter-year").value;

    updateSearchPieChart(pieChartData, selectedMonth, selectedYear);
    updateTouristSpotBarChart(touristSpotBarChartData, selectedMonth, selectedYear);
}


document.addEventListener("DOMContentLoaded", () => {
    applyChartFilters();
    console.log("Chart filters applied on page load.");
});


applyChartFilters();


//AJAX

function fetchDataFromServer() {
    const firebaseUrl = 'https://nav-angeles-thesis-default-rtdb.asia-southeast1.firebasedatabase.app';

// Fetch general data
fetch(firebaseUrl)
    .then(response => response.json())
    .then(data => {
        console.log('Data from Server:', data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Fetch registered users
fetch(`${firebaseUrl}/Users/Customers.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Registered Users:', data);
    })
    .catch(error => {
        console.error('Error fetching registered users:', error);
    });

// Fetch feedback data
fetch(`${firebaseUrl}/feedback.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Feedback Data:', data);
    })
    .catch(error => {
        console.error('Error fetching feedback data:', error);
    });
}
fetchDataFromServer();




function displayMonthlyYearlyVisits() {
    const selectedYear = document.getElementById("filter-visit-year").value;

    fetchDataFromNode("Tourist Spots", selectedYear, (touristSpotsData) => {
        const visitsData = countVisits(touristSpotsData, selectedYear);
        updateMonthlyYearlyVisitsTable(visitsData);
    });
}

// Function to fetch data from a specific node for a given year
function fetchDataFromNode(node, year, callback) {
    const nodeRef = firebase.database().ref(node);
    nodeRef.once("value")
        .then(snapshot => {
            const data = snapshot.val() || {};
            callback(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function countVisits(data, selectedYear) {
    const visitsData = {};

    // Iterate through places and add rows to the table
    Object.entries(data).forEach(([placeId, placeData]) => {
        const placeName = placeData.name;
        const placeMonth = placeData.month;
        const placeYear = placeData.year;

        // Check if the year is valid and matches the selected year
        if (placeYear === selectedYear) {
            // Ensure there is a structure for counting visits for each place
            if (!visitsData[placeName]) {
                visitsData[placeName] = {};
            }

            // Convert the month name to a number using the mapping
            const monthNumber = monthNumberMap[placeMonth];

            // Ensure there is a structure for counting visits for each month
            if (!visitsData[placeName][monthNumber]) {
                visitsData[placeName][monthNumber] = 0;
            }

            // Increment the visit count for the selected place and month
            visitsData[placeName][monthNumber]++;
        }
    });

    return visitsData;
}

// Function to update the Monthly/Yearly Visits table
function updateMonthlyYearlyVisitsTable(data) {
    const table = document.getElementById("monthlyYearlyVisitsTable").getElementsByTagName('tbody')[0];

    // Clear existing table content
    table.innerHTML = "";

    // Iterate through places and add rows to the table
    Object.entries(data).forEach(([placeName, monthData]) => {
        const row = table.insertRow();
        const placeNameCell = row.insertCell(0);
        placeNameCell.textContent = placeName;

        // Iterate through months and add cells to the row
        for (let month = 1; month <= 12; month++) {
            const monthCell = row.insertCell(month);
            const visitCount = monthData[month] || 0;
            monthCell.textContent = visitCount;
        }
    });
}

function updateTableOnYearChange() {
    const filterYearSelect = document.getElementById("filter-visit-year");

    filterYearSelect.addEventListener("change", () => {
        displayMonthlyYearlyVisits();
    });
}

// Call the function to update data when the page loads
document.addEventListener("DOMContentLoaded", () => {
    displayMonthlyYearlyVisits();
    updateTableOnYearChange();
});
});
