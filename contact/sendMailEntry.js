// NAME:  Charles Rawlins
// FUNC: sendMailEntry.js
// DESC: Creates a post reqeuest with a new email entry for the different
// security mailing lists.

// POST Request for CDT Email List
$(document).on('click','#cdtButton',function (event){

    event.preventDefault()
    const fullName = $("#cdtNameEntry").val();
    const newEmail = $("#cdtEmailEntry").val();
    const mailType = "CDT";
    emailRequest(fullName,newEmail,mailType);
    $("#cdtButton").addClass('disabled');

});

// POST Request for SS Email List
$(document).on('click','#secButton',function (event){

    event.preventDefault()
    const fullName = $("#secNameEntry").val();
    const newEmail = $("#cdtEmailEntry").val();
    const mailType = "SEC";
    emailRequest(fullName,newEmail,mailType);
    $("#secButton").addClass('disabled');

});

// API Call function for both email request types
function emailRequest(name,email,type){
    $.ajax({

        type:'POST',
        url:'https://acmsec.mst.edu:3000/emaillists',
        data:JSON.stringify({userName:name,userEmail:email, mailType:type}),
        datatype: "application/json",
        contentType: "application/json",

        success: function(json) {
            json = JSON.parse(json)
            const emailSuccess = json.emailSuccess

            if (emailSuccess){
                alert("Success! Check your spam folder!");
            }else{
                alert("Uh-oh! Something went wrong! Check your email formatting!");
            }

        },

        error: function() {
            alert("Error! Please refresh and try again!");
        }
    });

}


