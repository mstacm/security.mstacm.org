const bundlePrice = 20;
let numBundles = 1;
let shirtSize = 'S';

$(document).ready( () => {
    $('#numBundles').change( () => {
        const bundleNum = parseInt($('#numBundles').val());
        if (checkInvalid(bundleNum)) {
            alert("Please enter a valid number!");
        } else {
            numBundles = bundleNum;
            updatePrice();
        }
    });

    $('#smallRadio').change( () => {
        shirtSize = 'S';
    });

    $('#medRadio').change( () => {
        shirtSize = 'M';
    });

    $('#largeRadio').change( () => {
        shirtSize = 'L';
    });

    $('#xlRadio').change( () => {
        shirtSize = 'XL';
    });

    updatePrice();
});

function updatePrice() {
    $('#paymentCharge').text("Total Price: $" + bundlePrice * numBundles);

}

function checkInvalid(newVal) {
    return isNaN(newVal) || newVal < 1 || newVal % 1 !== 0;
}

function makeTransaction(transactionToken) {
    const userdata = {
        customerName: $('#customerName').val(),
        email: $('#merchEmail').val(),
        numBundles: numBundles,
        shirtSize: shirtSize,
        discCode: $('#merchDiscount').val(),
        transactionToken: transactionToken,
    };

    $.ajax({
        type: 'POST',
        url: 'https://acmsec.mst.edu/api/merch/submit-purchase',
        data: JSON.stringify(userdata),
        processData: false,
        contentType: 'application/json',

        success: (json) => {
            json = JSON.parse(json);
            const trxnSuccess = json.trxnSuccess;

            if (json.success) {
                alert("Your purchase was successful! You will be redirected shortly! Please check for an email in your spam filter!");
                window.setTimeout( () => {
                    // Move back to the march page
                    window.location.href = "https://acmsec.mst.edu/merch/";
                }, 3000);
            } else {
                alert("Uh-oh! Something went wrong. " + trxnSuccess + " Refresh and try again!");
            }

        },

        error: () => {
            alert("Error! Please refresh and try again!");
        },
    });
}
