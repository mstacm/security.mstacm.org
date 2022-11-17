$(document).ready(() => {
    $.ajax({
        type: "GET",
        url: "/getRegEvent",
        data: {
            slug: "cyber-boot-camp-2023"
        },

        success: (event) => {
            if (event.full.inPerson && event.full.online) {
                $("#cyber-boot-camp-2023 .go")
                    .css("pointer-events", "none")
                    .css("filter", "saturate(25%)")
                    .text("Registration is full");
            }
        },

        error: (response) => {
            console.error("Error getting event info:", response);
        }
    });

    // $.ajax({
    //     type: "GET",
    //     url: "/getRegEvent",
    //     data: {
    //         slug: "lockpicking-competition-2021"
    //     },

    //     success: (event) => {
    //         if (event.full.inPerson && event.full.online) {
    //             $("#lockpicking-competition-2021 .go")
    //                 .css("pointer-events", "none")
    //                 .css("filter", "saturate(25%)")
    //                 .text("Registration is full");
    //         }
    //     },

    //     error: (response) => {
    //         console.error("Error getting event info:", response);
    //     }
    // });
});
