// GET request to check if registration is full, otherwise redirect
$(document).on('click','#registerButton',function (event){
    event.preventDefault()

    $.ajax({
        type:'GET',
        url:'http://localhost:3001/getRegEvent',
        contentType: "application/json",

        success: function(json) {

            eventData = json

            if (eventData.canRegister){
                // Move to a new location or you can do something else
                window.location.replace(eventData.dataLink);

            }else{
                alert("Sorry! Registration is full! Please come back next year!")
                $("#registerButton").addClass('disabled')
            }
        },

        error: function() {
            alert("Error! Please refresh and try again!");
        }
    });

});


function loadReg(){

}
