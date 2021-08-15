
let currSum = 0
let currBundles = 0
let bundlePrice = 20
let shirtSize = 'S'
let discCode = "None"

$(document).ready(function(){
    $('#numBundles').change(function(event){
        let bundleText = $('#numBundles').val()
        bundleNum = parseInt(bundleText)
        if (checkInvalid(bundleNum)) {
            alert("Please enter a valid number!")
        } else {
            currBundles = bundleNum
            updatePrice()
        }

    });

    $('#smallRadio').change(function(event){
        shirtSize = 'S'
        console.log(shirtSize)
    });

    $('#medRadio').change(function(event){
        shirtSize = 'M'
        console.log(shirtSize)
    });

    $('#largeRadio').change(function(event){
        shirtSize = 'L'
        console.log(shirtSize)
    });

    $('#xlRadio').change(function(event){

        shirtSize = 'XL'
        console.log(shirtSize)
    });

    $('#merchDiscount').change(function(event){
        let discText = $('#merchDiscount').val()
        discCode = discText
    });

});

function updatePrice(){

    let sumPrice = bundlePrice*currBundles
    $('#paymentCharge').text( "Total Price: $" + sumPrice)

}

function checkInvalid(newVal){

    if(isNaN(newVal)){
        return true
    }
    if(newVal < 0){
        return true
    }

    return false
}

function makeTransaction(token){
    userdata = {}
    userdata.merchName = $('#merchName').val()
    userdata.email = $('#merchEmail').val()

    userdata.numBundles = currBundles
    userdata.shirtSize = shirtSize
    userdata.discCode = discCode
    userdata.token = token

    $.ajax({
        type:'POST',
        url:'http://localhost:3002/merchCharge',
        data:JSON.stringify({data:userdata}),
        processData: false,
        contentType: 'application/json',

        success: function(json) {
            json = JSON.parse(json)
            const trxnSuccess = json.trxnSuccess

            if (json.success){
                alert("Your purchase was successful! You will be redirected shortly! Please check for an email in your spam filter!");
                window.setTimeout(function(){
                    // Move back to the march page
                    window.location.href = "https://acmsec.mst.edu/merch/";
                }, 3000);
            }else{
                alert("Uh-oh! Something went wrong. " + trxnSuccess + " Refresh and try again!");
            }

        },

        error: function() {
            alert("Error! Please refresh and try again!");
        }
    });


}



