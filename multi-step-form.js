/*------------Validation Function-----------------*/
var count = 0; // To count blank fields.
function validation(event) {
var radio_check = document.getElementsByName('gender'); // Fetching radio button by name.
var input_field = document.getElementsByClassName('text_field'); // Fetching all inputs with same class name text_field and an html tag textarea.
var text_area = document.getElementsByTagName('textarea');

// Validating radio button.
if (radio_check[0].checked == false && radio_check[1].checked == false) {
	var y = 0;
} else {
	var y = 1;
}

// For loop to count blank inputs.
for (var i = input_field.length; i > count; i--) {
	if (input_field[i - 1].value == '' || text_area.value == '') {
		count = count + 1;
	} else {
		count = 0;
	}
}
if (count != 0 || y == 0) {
	alert("*All Fields are mandatory*"); // Notifying validation
	event.preventDefault();
} else {
	return true;
}
}

/*---------------------------------------------------------*/
// Function that executes on click of first next button.
function next_step1() {
	document.getElementById("first1").style.display = "none";
	document.getElementById("second1").style.display = "block";
	document.getElementById("active2").style.color = "#a4c34a";
}
// Function that executes on click of first previous button.
function prev_step1() {
	document.getElementById("first1").style.display = "block";
	document.getElementById("second1").style.display = "none";
	document.getElementById("active1").style.color = "#a4c34a";
	document.getElementById("active2").style.color = "gray";
}
// Function that executes on click of second next button.
function next_step2() {
	document.getElementById("second1").style.display = "none";
	document.getElementById("third1").style.display = "block";
	document.getElementById("active3").style.color = "#a4c34a";
}
// Function that executes on click of second previous button.
function prev_step2() {
	document.getElementById("third1").style.display = "none";
	document.getElementById("second1").style.display = "block";
	document.getElementById("active2").style.color = "#a4c34a";
	document.getElementById("active3").style.color = "gray";
}

//Functions to change color based on team type selection
function indivSelect(){
    document.getElementById("indiv").style.backgroundColor = "#ace011";
    document.getElementById("group").style.backgroundColor = "#A4C34A";
}

function groupSelect(){
    document.getElementById("indiv").style.backgroundColor = "#A4C34A";
    document.getElementById("group").style.backgroundColor = "#ace011";
}

//Functions that add and remove dynamic input
var boxcount = 1;
function new_link()
{
	boxcount++;
	var div1 = document.createElement('div');
	div1.id = boxcount;
	// link to delete extended form elements
	var delLink = '<div style="text-align:left; float: right; margin-right:220px; border-radius:5px;padding:2px; background-color:#004a00";><a href="javascript:delIt('+ boxcount +')" style="text-decoration:none; color:white; font-weight:700; height:1px;">-</a></div>';
	div1.innerHTML = document.getElementById('newlinktpl').innerHTML + delLink;
	document.getElementById('newlink').appendChild(div1);
}

// function to delete the newly added set of elements
function delIt(eleId)
{
	d = document;
	var element = d.getElementById(eleId);
	var parentElement = d.getElementById('newlink');
	parentElement.removeChild(element);
}

//put all values into an array for later
var teamNameInput = [];
var NameInput = [];
var EmailInput = [];
function insertValues(){
	for(var j = 0; j<= boxcount; j++){
	var team1 = document.getElementById("teamname").value[0];
	teamNameInput.push(team1);

	var name1 = document.getElementById("name").value[j];
	NameInput.push(name1);

	var email1 = document.getElementById("email").value[j];
	EmailInput.push(email1);
	}
}

//still working on the ones below
function clear(){
	for (var i =0; i<= boxcount; i++){
		teamNameInput.value[i] = "";
		NameInput.value[i] = "";
		EmailInput.value[i] = "";
	}
}

function thing(){
	for(var i=0; i<=boxcount; i++){
		document.write("<tr><td>"+teamNameInput[0]+"</td>");
		document.write("<td>"+NameInput[i]+"</td>");
		document.write("<td>"+EmailInput[i]+"</td></tr>");
	}}

function tabledisplay (teamnames,names,email) {
  for(i=0; i<boxcount;i++)
  {
   var $formrow = '<tr><td>'+teamnames[i]+'</td><td>'+names[i]+'</td><td>'+email[i]+'</td></tr>';
   $('.myTable').append($formrow);
  }
}

$('#indiv').click(function() {
    $('#addnew').css({
        'display': 'none'
    });
});