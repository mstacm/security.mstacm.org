
$(document).ready(function (){
    $.ajax({
        type:'GET',
        url:'http://localhost:3001/regCharge',
        contentType: "application/json",

        success: function(json) {
            generateUserForm(JSON.parse(json))
        },

        error: function() {
            alert("Error! Please refresh and try again!");
        }
    });
})

function generateUserForm(clientInfo){
    //Setup title info, pricing and payment button
    $("#userFormTitle").text(clientInfo.title + " Registration");
    $("#paymentCharge").append('Admission: '+clientInfo.admissionPrice)
    $("#submitButton").text("Pay " + clientInfo.admissionPrice)

    // Generate forms for document and get user data
    forms = clientInfo.forms
    for (i in forms){
        $("#userForms").append(
            '<label>'+forms[i].label+'</label> <br>' +
            '<input class="w-100 input-group-lg" id="'+forms[i].id+'" ' +
            'type="'+forms[i].type+'" ' +
            'placeholder="'+forms[i].placeholder+'" ' +
            'style="border-radius: 5px">'+
            '</p>');
    }

}

function makeTransaction(token){
    userdata = []

    for (i in forms){
        var key = forms[i].id
        var obj = {}
        obj[key] =$('#'+forms[i].id).val()
        userdata.push(obj)
    }
    obj = {"token":token}
    userdata.unshift(obj)

    $.ajax({
        type:'POST',
        url:'http://localhost:3001/regCharge',
        data:JSON.stringify({data:userdata}),
        processData: false,
        contentType: 'application/json',

        success: function(json) {
            json = JSON.parse(json)
            const trxnSuccess = json.trxnSuccess

            if (json.success){
                alert("Success! You are registered! " + trxnSuccess + " You will be redirected shortly!");
                window.setTimeout(function(){
                    // Move to a new location or you can do something else
                    window.location.href = "https://acmsec.mst.edu/events/";
                }, 5000);
            }else{
                alert("Uh-oh! Something went wrong. " + trxnSuccess + " Refresh and try again!");
            }

        },

        error: function() {
            alert("Error! Please refresh and try again!");
        }
    });


}



