console.log("Loaded Resource!")
let currSum = 0
let currShirts = 0
let currStick = 0
let currColl = 0
let shirtPrice = 25
let stickPrice = 5
let collPrice = 10

$(document).ready(function(){
    $('#numShirts').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
            let shirtText = $('#numShirts').val()
            shirtNum = parseInt(shirtText)
            if (checkInvalid(shirtNum)) {
                alert("Please enter a valid number!")
            } else {
                currShirts = shirtNum
                updatePrice()
            }
        }
    });

    $('#numStickers').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
            let stickText = $('#numStickers').val()
            stickNum = parseInt(stickText)
            if (checkInvalid(stickNum)) {
                alert("Please enter a valid number!")
            } else {
                currStick = stickNum
                updatePrice()
            }
        }
    });

    $('#numColl').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
            let collText = $('#numColl').val()
            collNum = parseInt(collText)
            if (checkInvalid(collNum)) {
                alert("Please enter a valid number!")
            } else {
                currColl = collNum
                updatePrice()
            }
        }
    });
});

function updatePrice(){

    let sumPrice = shirtPrice*currShirts + stickPrice*currStick + collPrice*currColl
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
    userdata.numShirts = currShirts
    userdata.numStickers = currStick
    userdata.numColl = currColl
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



