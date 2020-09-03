// Short script that disables registration for events at a certain time.

let regButton = document.getElementById("registerButton")
var now = new Date();
// September 3rd at midnight
var cutoff = new Date(2020, 8, 3, 0, 0, 0, 0)
var diff = cutoff - now;
if (diff < 0) {
    regButton.classList.add('disabled')
    regButton.innerText = "Registration is over!"
}else{
    console.log("You can still register!")
}