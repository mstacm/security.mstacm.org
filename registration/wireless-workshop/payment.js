(async function () {
    // Create a Stripe client
    const event = await fetch("/api/registration/event-info/wireless-workshop-2021")
        .then(response => response.json());
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
        $('#payment-submit').text("Please wait...");
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

    // Pass token to our server to finalize payment
    function makeTransaction(transactionToken) {
        $.ajax({
            type: 'POST',
            url: 'https://acmsec.mst.edu/api/registration/submit-purchase/wireless-workshop-2021',
            data: JSON.stringify({
                customerName: $('#name').val(),
                email: $('#email').val(),
                transactionToken: transactionToken,
                discCode: $('#discount-code').val(),
            }),
            contentType: 'application/json',

            success: (response) => {
                $('#payment-submit').text("Payment successfull");
                alert("Your payment was successful! Please complete the Google Form on the left if you have not already to complete your registration.");
            },

            error: (response) => {
                alert(`Uh-oh! Something went wrong. ${response} Refresh and try again!`);
            },
        });
    }
})();
