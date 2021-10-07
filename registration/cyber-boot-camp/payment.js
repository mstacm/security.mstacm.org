(async function () {
    // Create a Stripe client
    const event = await fetch("/getRegEvent")
        .then(response => response.json());

    // Reactively update cost based on selected attendance type 
    $("#cost-in-person").text("$" + event.cost.inPerson);
    $("#cost-online").text("$" + event.cost.online);

    let selectedCost = event.cost.inPerson;
    
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
    if (event.full) {
        alert("Sorry! This event is full and is no longer accepting registration.");
        window.history.back();
    };

    const stripe = Stripe(event.stripePK);

    // Create an instance of Elements
    const elements = stripe.elements();

    // Try to match bootstrap 4 styling
    const style = {
        base: {
            'lineHeight': '1.35',
            'fontSize': '1.11rem',
            'color': '#495057',
            'fontFamily': 'apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif'
        }
    };

    // Card number
    const card = elements.create('cardNumber', {
        'placeholder': '4242 4242 4242 4242',
        'style': style
    });
    card.mount('#card-number');

    // CVC
    const cvc = elements.create('cardCvc', {
        'placeholder': '111',
        'style': style
    });
    cvc.mount('#card-cvc');

    // Card expiry
    const exp = elements.create('cardExpiry', {
        'placeholder': '01/01',
        'style': style
    });
    exp.mount('#card-exp');

    // Submit
    $("form").on("submit", function (event) {
        event.preventDefault();
        $("#payment-submit")
            .prop("disabled", true)
            .val("Submitting...");
        const cardData = {
            "name": $("#name").val()
        };
        stripe.createToken(card, cardData).then(function (result) {
            if (result.error && result.error.message) {
                alert(result.error.message);
            } else {
                makeTransaction(result.token.id);
            }
        });
    });

    // Pass token to our server to finalize payment
    function makeTransaction(transactionToken) {
        $.ajax({
            type: 'POST',
            url: '/regCharge',
            data: JSON.stringify({
                customerName: $('#name').val(),
                email: $('#email').val(),
                phoneNumber: $('#phone-number').val(),
                major: $('#major').val(),
                year: $('input[name="year"]:checked').val(),
                attendanceType: $('input[name="attending"]:checked').val(),
                transactionToken: transactionToken,
                // discCode: $('#discount-code').val(),
                discCode: "",
            }),
            contentType: 'application/json',

            success: (response) => {
                $('#payment-submit').val("Payment successful");
                $("#registration-success").modal("show");
            },

            error: (response) => {
                alert(`Uh-oh! Something went wrong. ${response} Refresh and try again!`);
            },
        });
    }
})();
