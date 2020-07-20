// NAME: Charles Rawlins
// Func: learningGen.js
// Desc: This script automatically generates the learning resource
// and course entries for the learnSecurity.html page.

// Basic class used for handling learning resource data.
class learningEntry{

    constructor(learningEntry) {
        this.learning = learningEntry;
        this.contentID = "Content" + this.learning.replace(/\s/g, '');
        this.tabID = "ID" + this.learning.replace(/\s/g, '');
        this.learningEntries = [];
    }

    addEntry(dataEntry){
        var newData = {name:dataEntry.name, site:dataEntry.site};
        this.learningEntries.push(newData);
    }

}

// Basic class used for handling the Missouri S&T course data.
class classEntry{

    constructor(classEntry) {
        this.class = classEntry;
        this.contentID = "Content" + this.class.replace(/\s/g, '');
        this.tabID = "ID" + this.class.replace(/\s/g, '');
        this.classEntries = [];
    }

    addEntry(dataEntry){
        // TODO: Edit with params
        var newData = {name:dataEntry.name, site:dataEntry.site};
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

            }else{ // Officer entry (can add more categories if needed later)
                workingSite.addEntry(data[i]);
            }

        }
        catEntries.push(workingSite);

        // Generate cat tab html code
        var catBlock = '';
        for(var i = 0; i < catEntries.length; i++) {

            catBlock += '<li class="nav-item py-2">';
            if(i == 0){
                catBlock += '<a class="nav-link active" id="'+catEntries[i].tabID+'" data-toggle="tab" href="#' + catEntries[i].contentID+'" role="tab" aria-controls="'+catEntries[i].contentID+'" aria-selected="true">'+catEntries[i].learning+'</a>'
            }else{
                catBlock += '<a class="nav-link" id="'+catEntries[i].tabID+'" data-toggle="tab" href="#' + catEntries[i].contentID+'" role="tab" aria-controls="'+catEntries[i].contentID+'" aria-selected="false">'+catEntries[i].learning+'</a>'
            }

            catBlock += '</li>'

        }
        let resourceTab = document.getElementById('resourceTab')
        resourceTab.innerHTML += catBlock

        var tabContents = document.getElementById('resourceTabContent')

        // Generate year tab contents from learning csv file.
        for (var i = 0; i < catEntries.length; i++){

            tabBlock = "";
            if(i == 0){
                tabBlock += '<div class="tab-pane fade show active" id="'+catEntries[i].contentID+'" role="tabpanel" aria-labelledby="'+catEntries[i].tabID+'">';
            }else{
                tabBlock += '<div class="tab-pane fade show" id="'+catEntries[i].contentID+'" role="tabpanel" aria-labelledby="'+catEntries[i].tabID+'">';
            }
            tabBlock += '<div class="row justify-content-md-center mt-2">';

            for(var j=0;j < catEntries[i].learningEntries.length; j++){
                // tabBlock += '<div class="col-sm-2" >';
                tabBlock += '<a class="btn btn-primary mx-1 my-1" href="'+catEntries[i].learningEntries[j].site +'" target="_blank">'+catEntries[i].learningEntries[j].name+'</a><br/>';
                // tabBlock += '</div>'; // Col div
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

            }else{ // Officer entry (can add more categories if needed later)
                workingSite.addEntry(data[i]);
            }

        }
        catEntries.push(workingSite);

        // Generate cat tab html code
        var catBlock = '';
        for(var i = 0; i < catEntries.length; i++) {

            catBlock += '<li class="nav-item py-2">';
            if(i == 0){
                catBlock += '<a class="nav-link active" id="'+catEntries[i].tabID+'" data-toggle="tab" href="#' + catEntries[i].contentID+'" role="tab" aria-controls="'+catEntries[i].contentID+'" aria-selected="true">'+catEntries[i].learning+'</a>'
            }else{
                catBlock += '<a class="nav-link" id="'+catEntries[i].tabID+'" data-toggle="tab" href="#' + catEntries[i].contentID+'" role="tab" aria-controls="'+catEntries[i].contentID+'" aria-selected="false">'+catEntries[i].learning+'</a>'
            }

            catBlock += '</li>'

        }
        let resourceTab = document.getElementById('resourceTab')
        resourceTab.innerHTML += catBlock

        var tabContents = document.getElementById('resourceTabContent')

        // Generate year tab contents from learning csv file.
        for (var i = 0; i < catEntries.length; i++){

            tabBlock = "";
            if(i == 0){
                tabBlock += '<div class="tab-pane fade show active" id="'+catEntries[i].contentID+'" role="tabpanel" aria-labelledby="'+catEntries[i].tabID+'">';
            }else{
                tabBlock += '<div class="tab-pane fade show" id="'+catEntries[i].contentID+'" role="tabpanel" aria-labelledby="'+catEntries[i].tabID+'">';
            }
            tabBlock += '<div class="row justify-content-md-center mt-2">';

            for(var j=0;j < catEntries[i].learningEntries.length; j++){
                // tabBlock += '<div class="col-sm-2" >';
                tabBlock += '<a class="btn btn-primary mx-1 my-1" href="'+catEntries[i].learningEntries[j].site +'" target="_blank">'+catEntries[i].learningEntries[j].name+'</a><br/>';
                // tabBlock += '</div>'; // Col div
            }
            tabBlock += '</div>'; // Row div
            tabBlock += '</div>'; // tab div

            tabContents.innerHTML += tabBlock;

        }
    });

}





