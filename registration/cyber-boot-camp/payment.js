// TODO: Test and make sure this still works after the backend changes
(async function () {
    // Download this event's information from the server
    const event = await $.ajax("http://localhost:3001/getRegEvent", {
        data: {
            slug: $("#slug").val(),
        },
    });

    // Update cost based on selected attendance type 
    $("#cost-in-person").text("$" + event.cost.inPerson);
    $("#cost-online").text("$" + event.cost.online);

    let selectedCost;
    
    $("#attending-in-person")
        .on("change", function () {
            if ($(this).is(":checked")) {
                selectedCost = event.cost.inPerson;
                $("#payment-amount").text("$" + selectedCost);
            }
        });
    $("#attending-online")
        .on("change", function () {
            if ($(this).is(":checked")) {
                selectedCost = event.cost.online;
                $("#payment-amount").text("$" + selectedCost);
            }
        });

    $("#payment-amount").text("$" + selectedCost);

    // Do not allow the user to register if the event is full
    if (event.full.inPerson && event.full.online) {
        alert("Sorry! This event is full and is no longer accepting registration.");
        window.history.back();
    } else if (event.full.inPerson) {
        $("#attending-in-person").prop("disabled", true);
        $("#attending-online").prop("checked", true);
        $("#warnings").text("⚠ In-person registration is now full.");
    } else if (event.full.online) {
        $("#attending-online").prop("disabled", true);
        $("#attending-in-person").prop("checked", true);
        $("#warnings").text("⚠ Online registration is now full.");
    }

    if ($("#attending-in-person").is(":checked")) {
        selectedCost = event.cost.inPerson;
        $("#payment-amount").text("$" + selectedCost);
    } else if ($("#attending-online").is(":checked")) {
        selectedCost = event.cost.online;
        $("#payment-amount").text("$" + selectedCost);
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
            await $.ajax({
                type: "POST",
                url: "http://localhost:3001/regCharge",
                data: JSON.stringify({
                    slug: $("#slug").val(),
                    customerName: $("#name").val(),
                    email: $("#email").val(),
                    major: $("#major").val(),
                    year: $('input[name="year"]:checked').val(),
                    attendanceType: $('input[name="attending"]:checked').val(),
                    transactionToken: transactionToken,
                    // discCode: $("#discount-code").val(),
                    discCode: "",
                    extra: {
                        phoneNumber: $("#phone-number").val(),
                    }
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
