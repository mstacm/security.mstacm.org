(async function () {
    // Download this event's information from the server
    const event = await $.ajax("/getRegEvent", {
        data: {
            slug: $("#slug").val(),
        },
    });

    $("#payment-amount").text("$" + event.cost.inPerson);

    // Do not allow the user to register if the event is full
    if (event.full.inPerson) {
        alert("Sorry! This event is full and is no longer accepting registration.");
        window.history.back();
    }

    // Create a Stripe client
    const stripe = Stripe(event.stripePK);

    // Create an instance of Elements
    const elements = stripe.elements();

    // Try to match bootstrap 4 styling
    const style = {
        base: {
            "lineHeight": "1.35",
            "fontSize": "1.11rem",
            "color": "#495057",
            "fontFamily": 'apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
        }
    };

    // Card number
    const card = elements.create("cardNumber", {
        "placeholder": "4242 4242 4242 4242",
        "style": style
    });
    card.mount("#card-number");

    // CVC
    const cvc = elements.create("cardCvc", {
        "placeholder": "111",
        "style": style
    });
    cvc.mount("#card-cvc");

    // Card expiry
    const exp = elements.create("cardExpiry", {
        "placeholder": "01/01",
        "style": style
    });
    exp.mount("#card-exp");

    // Submit
    $("form").on("submit", async function (e) {
        e.preventDefault();
        $("#payment-submit")
            .prop("disabled", true)
            .val("Submitting...");
        try {
            const result = await stripe.createToken(card, {
                "name": $("#name").val(),
            });
            await submitOrder(result.token.id);
        } catch (error) {
            alert(result.error.message);
        }
    });

    // Pass token to our server to finalize payment
    async function submitOrder(transactionToken) {
        try {
            // TODO: Can you get the form inputs from the form element itself?
            await $.ajax({
                type: "POST",
                url: "/regCharge",
                data: JSON.stringify({
                    slug: $("#slug").val(),
                    customerName: $("#name").val(),
                    email: $("#email").val(),
                    major: $("#major").val(),
                    year: $('input[name="year"]:checked').val(),
                    attendanceType: $('input[name="attending"]').val(),
                    transactionToken: transactionToken,
                    discCode: $("#discount-code").val(),
                }),
                contentType: "application/json",
            });
        } catch (error) {
            alert(`Uh-oh! Something went wrong. ${error} Refresh and try again!`);
        }
        $("#payment-submit").val("Payment successful");
        $("#registration-success").modal("show");
    }
})();
