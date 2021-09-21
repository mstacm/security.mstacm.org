(async function () {
    // Create a Stripe client
    const event = await fetch("/getRegEvent")
        .then(response => response.json());

        
    $("#payment-amount").text("$" + event.cost);
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
    $('#payment-submit').on('click', function (e) {
        e.preventDefault();
        $('#payment-submit').prop('disabled', true);
        $('#payment-submit').text("Submitting...");
        const cardData = {
            'name': $('#name').val()
        };
        stripe.createToken(card, cardData).then(function (result) {
            if (result.error && result.error.message) {
                alert(result.error.message);
            } else {
                makeTransaction(result.token.id);
            }
        });
    });

    $("#agree").on("change", function (e) {
        if (e.currentTarget.checked) {
            $("#payment-submit").prop('disabled', false);
        } else {
            $("#payment-submit").prop('disabled', true);
        }
    });

    // Pass token to our server to finalize payment
    function makeTransaction(transactionToken) {
        $.ajax({
            type: 'POST',
            // url: 'https://acmsec.mst.edu/api/registration/submit-purchase/wireless-workshop-2021',
            url: '/regCharge',
            data: JSON.stringify({
                customerName: $('#name').val(),
                email: $('#email').val(),
                major: $('#major').val(),
                year: $('input[name="year"]:checked').val(),
                discovered: $('input[name="discovered"]:checked').val(),
                experience: $('input[name="experience"]:checked').val(),
                membership: $('input[name="membership"]:checked').val(),
                commentsQuestions: $('#comments-questions').val(),
                transactionToken: transactionToken,
                // discCode: $('#discount-code').val(),
                discCode: "",
            }),
            contentType: 'application/json',

            success: (response) => {
                $('#payment-submit').text("Payment successful");
                alert("Your payment was successful! Please complete the Google Form on the left if you have not already to complete your registration.");
            },

            error: (response) => {
                alert(`Uh-oh! Something went wrong. ${response} Refresh and try again!`);
            },
        });
    }
})();
