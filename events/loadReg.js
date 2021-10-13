$(document).ready(() => {
    $.ajax({
        type:"GET",
        url:"/getRegEvent",
        contentType: "application/json",

        success: (event) => {
            if (event.full.inPerson && event.full.online) {
                $("#register-button").css("pointer-events", "none");
                $("#register-button").css("filter", "saturate(25%)");
                $("#register-button").text("Registration is full");
            }
        },

        error: (response) => {
            console.error("Error getting event info:", response);
        }
    });
});
