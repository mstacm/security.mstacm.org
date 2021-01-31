/**
 * Officer history profile generation script
 *
 * Generates the ACM officer history for the archive page
 *
 * @file   officerHistoryGen.js
 * @author Charles Rawlins
 */

// Generate the officer cards upon load of /archive
window.onload = generateOfficersHistory();

/**
 * Officer history content generation API call
 *
 * Calls the data from the site backend for content generation
 */
function generateOfficersHistory(){

    var officersHistory;
    // Get learning content from backend
    $.ajax({
        type:'GET',
        url:'https://acmsec.mst.edu:3003/officerHistory',
        contentType: "application/json",

        success: function(json) {

            officersHistory = json['officerHistory']

            generateProfiles(officersHistory);
        },

        error: function() {
            alert("Error! Please refresh and try again!");
        }
    });

}


/**
 * Officer history profile generation script
 *
 * Creates the auto-generated officer profiles for the entire ACM officer history
 */
function generateProfiles(yearEntries){

// Generate year tabs
    for(var i = 0; i < yearEntries.length; i++) {
        // Example entry
        // <li class="nav-item">
        //     <a class="nav-link active" id="2021" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
        //     </li>


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

        // Example entry.
        // <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">...</div>
        //     <div class="tab-pane fade show active" id="Fall2019Content" role="tabpanel" aria-labelledby="Fall2019ID" aria-selected="true">
        //         <div class="row justify-content-md-center" >
        //         <div class="col-md-auto" >
        //         <div class="card h-auto mb-3" style="width: 15rem;">
        //         <div class="card-header">Club Chair</div>
        //     <img class="img-fluid" src="../images/officers/kevin-newell.png" alt="Kevin" style="width: 100%">
        //         <div class="card-body"style="width: 15rem;">
        //         <h5 class="card-title">Kevin Newell</h5>
        //     <p class="card-text">Likes coding and being alive.</p>
        //     </div>
        //     <ul class="list-group list-group-flush">
        //         <li class="list-group-item">CS Senior</li>
        //     </ul>
        //     <div class="card-footer"style="width: 15rem;">
        //         <a href="mailto:kanm29@mst.edu" class="btn btn-secondary">Email</a>
        //         </div>
        //         </div>
        //         </div>
        //
        //         </div>
        //         </div>

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
            tabBlock += '<div class="card h-100 mb-3 bg-dark text-white" style="width: 15rem;">'

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
                    tabBlock += '<a href="mailto:' + yearEntries[i].officerEntries[j].email + '" class="btn btn-primary float-left">Email</a>';
                }

                if (yearEntries[i].officerEntries[j].linkedin != "N/A") {
                    tabBlock += '<a href="' + yearEntries[i].officerEntries[j].linkedin + '" class="btn btn-primary float-right">LinkedIn</a>';
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

};