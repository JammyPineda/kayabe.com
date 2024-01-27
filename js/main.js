(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    

    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";


    // Worldwide Sales Chart
    var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    var myChart1 = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: ["2020", "2021", "2022", "2023"],
            datasets: [{
                    label: "Walking Street",
                    data: [15, 30, 55, 65, 60, 80, 95],
                    backgroundColor: "rgb(151, 222, 255)"
                },
                {
                    label: "Museu ning Angeles",
                    data: [8, 35, 40, 60, 70, 55, 75],
                    backgroundColor: "rgb(6, 143, 255)"
                },
                {
                    label: "Carmelite Monastery",
                    data: [12, 25, 45, 55, 65, 70, 60],
                    backgroundColor: "rgb(161, 204, 209)"
                }
            ]
            },
        options: {
            responsive: true
        }
    });

    
})(jQuery);


