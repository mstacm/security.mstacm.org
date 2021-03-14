console.log("Loaded Resource!")
let currSum = 0
let currBundles = 0
let bundlePrice = 20
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

function getShirtsize(){
    var shirtSize = 'S'
    if ($("#smallRadio").prop("checked", true)){
        shirtSize = 'S'
    }else if ($("#medRadio").prop("checked", true)){
        shirtSize = 'M'
    }else if ($("#largeRadio").prop("checked", true)){
        shirtSize = 'L'
    }else if ($("#xlRadio").prop("checked", true)){
        shirtSize = 'XL'
    }

    return shirtSize
}

function makeTransaction(token){
    userdata = {}
    userdata.merchName = $('#merchName').val()
    userdata.email = $('#merchEmail').val()

    userdata.numBundles = currBundles
    userdata.shirtSize = getShirtSize()
    userdata.discCode = discCode
    userdata.token = token

    $.ajax({
        type:'POST',
        url:'http://acmsec.mst.edu:3002/merchCharge',
        data:JSON.stringify({data:userdata}),
        processData: false,
        contentType: 'application/json',

        success: function(json) {
            json = JSON.parse(json)
            const trxnSuccess = json.trxnSuccess

            if (json.success){
                alert("Your purchase was successful! You will be redirected shortly!");
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



