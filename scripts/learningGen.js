// NAME: Charles Rawlins
// Func: learningGen.js
// Desc: These functions dynamically generates/deletes the learning resource
// and course entries for the learnSecurity.html page.

// Basic class used for handling learning data.
class learningEntry{

    constructor(learningEntry) {
        this.year = yearEntry;
        this.contentID = "Content" + this.year.replace(/\s/g, '');
        this.tabID = "ID" + this.year.replace(/\s/g, '');
        this.officerEntries = [];
    }

    addEntry(dataEntry){

        var newOfficer = {name:dataEntry.name, role:dataEntry.role, image:dataEntry.image, educ:dataEntry.education, desc:dataEntry.officerDesc, email:dataEntry.email, linkedin:dataEntry.linkedin};
        this.officerEntries.push(newOfficer);
    }

}

// Generate content upon load of learningResources.html
window.onload = generateLearning();
// window.onload = generateCourses();

// Calls the d3 csv read function and parses/generates officer card entries for officersAndContact.html
function generateLearning(){
    // Read in officer data with d3 (let this be the only function processed for clarity)
    d3.csv("../miscContent/OfficerProfiles.csv").then(function(data){

        // Parse csv lines into headers and officer data
        var yearEntries = [];
        var workingYear = {};
        for(var i = 0; i < data.length; i++){


            if(data[i].desc == "YEAR"){ // Year category entry
                if(Object.keys(workingYear).length != 0) {
                    yearEntries.push(workingYear);
                }
                workingYear = new yearEntry(data[i].name);


            }else{ // Officer entry (can add more categories if needed later)
                workingYear.addEntry(data[i]);

            }

        }
        yearEntries.push(workingYear);

        // Generate year tabs
        for(var i = 0; i < yearEntries.length; i++) {
            // This is one way to generate alot of html code with js, the officer entry shows another way.
            yearBlock = document.createElement('li',);
            yearBlock.setAttribute('class', 'nav-item');
            yearParam = document.createElement('a');
            if (i == 0) {
                yearParam.setAttribute('class', 'nav-link active');
            } else {
                yearParam.setAttribute('class', 'nav-link');
            }
            yearParam.setAttribute('id', yearEntries[i].tabID);
            yearParam.setAttribute('data-toggle', 'pill');
            yearParam.setAttribute('href', "#" + yearEntries[i].contentID);
            yearParam.setAttribute('role', 'tab');
            yearParam.setAttribute('aria-controls', yearEntries[i].contentID);
            if (i == 0) {
                yearParam.setAttribute('aria-selected', 'true');
            } else {
                yearParam.setAttribute('aria-selected', 'false');
            }
            // yearParam.setAttribute('style','color: dark;');
            yearParam.innerHTML = yearEntries[i].year;
            yearBlock.appendChild(yearParam);
            yearTabs = document.getElementById("yearTabs");
            yearTabs.appendChild(yearBlock);
            // yearTabs.style.marginBottom = "20px";

        }

        // Generate year tab contents from officer csv file.
        var officerTabContents = document.getElementById("officerTabContents");

        for (var i = 0; i < yearEntries.length; i++){

            // Tab officer Content
            // Tab div
            tabBlock = "";
            if (i == 0){
                var tabBlock = '<div class="tab-pane fade show active" id="' + yearEntries[i].contentID + '"' +
                    ' role="tabpanel" aria-labelledby="'+ yearEntries[i].tabID + '" aria-selected="true">';
            }else{
                var tabBlock = '<div class="tab-pane fade show" id="' + yearEntries[i].contentID + '"' +
                    ' role="tabpanel" aria-labelledby="'+ yearEntries[i].tabID + '" aria-selected="false">';
            }
            // Row div
            tabBlock += '<div class="row justify-content-md-center py-1" style="background-color:#17191c;">';

            for(var j = 0; j < yearEntries[i].officerEntries.length; j++) {

                // Officer col div
                tabBlock += '<div class="col-md-auto py-2">'; // d-flex align-items-stretch" >';
                // Officer Card div
                if(yearEntries[i].year == "Spring 2020" || yearEntries[i].year == "Fall 2019"){
                    tabBlock += '<div class="card h-100 mb-3 bg-dark text-white" style="width: 15rem;">'
                }else{
                    tabBlock += '<div class="card h-75 mb-3 bg-dark text-white" style="width: 15rem;">'
                }
                // Card header
                tabBlock += '<div class="card-header">' + yearEntries[i].officerEntries[j].role + '</div>'
                // Card image
                if (yearEntries[i].officerEntries[j].image == "N/A") {
                    tabBlock += '<img class="img-fluid" src="../images/OldOfficerPics/blank.png" alt="' +
                        yearEntries[i].officerEntries[j].name + '" style="width: 100%">';

                } else if(yearEntries[i].officerEntries[j].image == "BLANK"){
                    // Empty image
                }else {
                    tabBlock += '<img class="img-fluid" src="' + yearEntries[i].officerEntries[j].image + '" alt="' +
                        yearEntries[i].officerEntries[j].name + '" style="width: 100%">';
                }


                // Card body div
                tabBlock += '<div class="card-body"style="width: 15rem;">';
                // Card body title
                tabBlock += '<h5 class="card-title">' + yearEntries[i].officerEntries[j].name + '</h5>';
                // Card body desc.
                if (yearEntries[i].officerEntries[j].desc != "N/A") {
                    tabBlock += '<p class="card-text">' + yearEntries[i].officerEntries[j].desc + '\n</p>';
                    tabBlock += '<p class="card-text">' + yearEntries[i].officerEntries[j].educ + '</p>';
                }

                // Card body /div
                tabBlock += '</div>';

                //Card email and linkedin
                if((yearEntries[i].officerEntries[j].email || yearEntries[i].officerEntries[j].linkedin) != "N/A") {
                    tabBlock += '<div class="card-footer " style="width: 15rem;">';
                    if (yearEntries[i].officerEntries[j].email != "N/A") {
                        tabBlock += '<a href="mailto:' + yearEntries[i].officerEntries[j].email + '" class="btn btn-secondary float-left">Email</a>';
                    }

                    if (yearEntries[i].officerEntries[j].linkedin != "N/A") {
                        tabBlock += '<a href="' + yearEntries[i].officerEntries[j].linkedin + '" class="btn btn-secondary float-right">LinkedIn</a>';
                    }
                    // Card footer /div
                    tabBlock += '</div>';

                }
                // Officer card /div
                tabBlock += '</div>';
                // Officer col /div
                tabBlock += '</div>';
            }

            // Row /div
            tabBlock += '</div>';
            // Tab /div
            tabBlock +='</div>';
            officerTabContents.innerHTML += tabBlock;

        }
    });

}





