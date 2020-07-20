// NAME: Charles Rawlins
// Func: learningGen.js
// Desc: This script automatically generates the learning resource
// and course entries for the learnSecurity.html page.

// Basic class used for handling learning resource data.
class learningEntry{

    // Generate tab and content IDs for handling nav javascript
    constructor(learningEntry) {
        this.learning = learningEntry;
        this.contentID = "Content" + this.learning.replace(/\s/g, '');
        this.tabID = "ID" + this.learning.replace(/\s/g, '');
        this.learningEntries = [];
    }

    // Convert data over...
    addEntry(dataEntry){
        var newData = {name:dataEntry.name, site:dataEntry.site};
        this.learningEntries.push(newData);
    }

}

// Basic class used for handling the Missouri S&T course data.
class classEntry{

    // Generate tab and content IDs for handling nav javascript
    constructor(catEntry) {
        this.class = catEntry;
        this.contentID = "Content" + this.class.replace(/\s/g, '');
        this.tabID = "ID" + this.class.replace(/\s/g, '');
        this.classEntries = [];
    }

    addEntry(dataEntry){
        // Convert data over...
        var newData = {course:dataEntry.course,year:dataEntry.year,title:dataEntry.title,details:dataEntry.details,level:dataEntry.level};
        this.classEntries.push(newData);
    }

}

// Generate content for both navs upon load of learningResources.html
window.onload = generateLearning();
window.onload = generateCourses();

// TODO: make website entries cards with descriptions?
// Calls the d3 csv read function and parses/generates entries for the learning resources.
function generateLearning(){
    // Read in learning data with d3 (let this be the only function processed for clarity)
    d3.csv("../miscContent/learningResources.csv").then(function(data){

        // Parse csv lines into headers and officer data
        var catEntries = [];
        var workingSite = {};
        for(var i = 0; i < data.length; i++){

            if(data[i].desc == "CAT"){ // Year category entry
                if(Object.keys(workingSite).length != 0) {
                    catEntries.push(workingSite);
                }
                workingSite = new learningEntry(data[i].name);

            }else{ // Resource entry (can add more categories if needed later)
                workingSite.addEntry(data[i]);
            }

        }
        catEntries.push(workingSite);

        // Generate cat tab html code
        var catBlock = '';
        for(var i = 0; i < catEntries.length; i++) {

            // li entry example:
            // <li class="nav-item">
            //      <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
            // </li>

            catBlock += '<li class="nav-item py-2">';
            if(i == 0){
                catBlock += '<a class="nav-link active" id="'+catEntries[i].tabID+'" data-toggle="tab" href="#' +
                    catEntries[i].contentID+'" role="tab" aria-controls="'+catEntries[i].contentID+'" ' +
                    'aria-selected="true">'+catEntries[i].learning+'</a>'
            }else{
                catBlock += '<a class="nav-link" id="'+catEntries[i].tabID+'" data-toggle="tab" href="#' +
                    catEntries[i].contentID+'" role="tab" aria-controls="'+catEntries[i].contentID+'" ' +
                    'aria-selected="false">'+catEntries[i].learning+'</a>'
            }

            catBlock += '</li>'

        }
        let resourceTab = document.getElementById('resourceTab')
        resourceTab.innerHTML += catBlock

        var tabContents = document.getElementById('resourceTabContent')

        // Generate tab contents from learning csv file.
        for (var i = 0; i < catEntries.length; i++){
            // learning resource button example:
            // <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            //     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, eveniet earum. Sed accusantium eligendi molestiae quo hic velit nobis et, tempora placeat ratione rem blanditiis voluptates vel ipsam? Facilis, earum!</p>
            // </div>

            tabBlock = "";
            if(i == 0){
                tabBlock += '<div class="tab-pane fade show active" id="'+catEntries[i].contentID +'" role="tabpanel"' +
                    ' aria-labelledby="'+catEntries[i].tabID+'">';
            }else{
                tabBlock += '<div class="tab-pane fade show" id="'+catEntries[i].contentID+'" role="tabpanel" ' +
                    'aria-labelledby="'+catEntries[i].tabID+'">';
            }
            tabBlock += '<div class="row justify-content-md-center mt-2">';

            for(var j=0;j < catEntries[i].learningEntries.length; j++){
                tabBlock += '<a class="btn btn-primary mx-1 my-1" href="'+catEntries[i].learningEntries[j].site +
                    '" target="_blank">'+catEntries[i].learningEntries[j].name+'</a><br/>';
            }
            tabBlock += '</div>'; // Row div
            tabBlock += '</div>'; // tab div

            tabContents.innerHTML += tabBlock;

        }
    });

}

// Calls the d3 csv read function and parses/generates entries for the course resources.
function generateCourses(){
    // Read in learning data with d3 (let this be the only function processed for clarity)
    d3.csv("../miscContent/secClasses.csv").then(function(data){

        // Parse csv lines into headers and officer data
        var catEntries = [];
        var workingClass = {};
        for(var i = 0; i < data.length; i++){

            if(data[i].desc == "CAT"){ // Year category entry
                if(Object.keys(workingClass).length != 0) {
                    catEntries.push(workingClass);
                }
                workingClass = new classEntry(data[i].course);

            }else{ // Class entry (can add more categories if needed later)
                workingClass.addEntry(data[i]);
            }

        }
        catEntries.push(workingClass);

        // Generate cat tab html code
        var catBlock = '';
        for(var i = 0; i < catEntries.length; i++) {

            catBlock += '<li class="nav-item py-2">';
            if(i == 0){
                catBlock += '<a class="nav-link active" id="'+catEntries[i].tabID+'" data-toggle="tab" href="#' +
                    catEntries[i].contentID+'" role="tab" aria-controls="'+catEntries[i].contentID+'" ' +
                    'aria-selected="true">'+catEntries[i].class+'</a>'
            }else{
                catBlock += '<a class="nav-link" id="'+catEntries[i].tabID+'" data-toggle="tab" href="#' +
                    catEntries[i].contentID+'" role="tab" aria-controls="'+catEntries[i].contentID+'" ' +
                    'aria-selected="false">'+catEntries[i].class+'</a>'
            }

            catBlock += '</li>'

        }
        let classTab = document.getElementById('classTab')
        classTab.innerHTML += catBlock

        var classTabContents = document.getElementById('classTabContent')

        // Generate year tab contents from learning csv file.
        for (var i = 0; i < catEntries.length; i++){

            // Example cards:
            // <div class="card h-100 mb-3 bg-primary text-black-50" style="width: 15rem;">
            //     <div class="card-header">CompSci 2500 (2020)</div>
            // <div class="card-body" style="width: 15rem;">
            //     <h5 class="card-title">Algorithms</h5>
            //     <p class="card-text">Intro to basic algorithms.</p>
            // </div>
            // </div>

            tabBlock = "";
            if(i == 0){
                tabBlock += '<div class="tab-pane fade show active" id="'+catEntries[i].contentID+
                    '" role="tabpanel" aria-labelledby="'+catEntries[i].tabID+'">';
            }else{
                tabBlock += '<div class="tab-pane fade show" id="'+
                    catEntries[i].contentID+'" role="tabpanel" aria-labelledby="'+catEntries[i].tabID+'">';
            }
            tabBlock += '<div class="row d-flex justify-content-md-center mt-2">';

            for(var j=0;j < catEntries[i].classEntries.length; j++){
                // Change background color based on course difficulty level
                switch(catEntries[i].classEntries[j].level){
                    case 'Undergrad_Grad':
                        tabBlock += '<div class="card  mb-3 mx-2 bg-warning text-black-50" style="width: 15rem;">';
                        break;
                    case 'Grad':
                        tabBlock += '<div class="card  mb-3 mx-2 bg-danger text-black-50" style="width: 15rem;">';
                        break;
                    case 'Undergrad':
                    default:
                        tabBlock += '<div class="card mb-3 mx-2 bg-primary text-black-50" style="width: 15rem;">';
                        break;
                };

                tabBlock += '<div class="card-header">'+catEntries[i].classEntries[j].course+' ('+
                    catEntries[i].classEntries[j].year+')</div>';
                tabBlock += '<div class="card-body" style="width: 15rem;">';
                tabBlock += '<h5 class="card-title">'+catEntries[i].classEntries[j].title+'</h5>';
                tabBlock += '<p class="card-text">'+catEntries[i].classEntries[j].details+'</p>';
                tabBlock += '</div>';
                tabBlock += '</div>';
            }
            tabBlock += '</div>'; // Row div
            tabBlock += '</div>'; // tab div

            classTabContents.innerHTML += tabBlock;

        }
    });

}





