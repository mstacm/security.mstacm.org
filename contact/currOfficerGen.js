/**
 * Current officer profile generation script
 *
 * Generates the officer profiles for the contact page
 *
 * @file   currOfficerGen.js
 * @author Charles Rawlins
 */

// Generate the officer cards upon load of /contact/
window.onload = generateCurrOfficers();

/**
 * Officer content generation API call
 *
 * Calls the data from the site backend for content generation
 */
function generateCurrOfficers(){

    var currOfficers;
    // Get learning content from backend
    $.ajax({
        type:'GET',
        url:'https://acmsec.mst.edu:3003/currentOfficers',
        contentType: "application/json",

        success: function(json) {

            currOfficers = json['currOfficers']

            generateProfiles(currOfficers);
        },

        error: function() {
            alert("Error! Please refresh and try again!");
        }
    });

}

/**
 * Officer profile generation
 *
 * Generates the current officer profiles
 */
function generateProfiles(currOfficers){

    // Generate year
    yearEle = document.getElementById('officerYear')
    yearEle.innerText = yearEle.innerText + ' (' +currOfficers.year + ')';

    // Generate year tab contents from officer csv file.
    var officerContents = document.getElementById('officerContents');

    officerEntries = currOfficers.officerEntries;

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
    var tabBlock = '<div class="tab-pane fade show active" id="' + currOfficers.contentID + '"' +
        ' role="tabpanel" aria-labelledby="'+ currOfficers.tabID + '" aria-selected="true">';
    // Row div
    tabBlock += '<div class="row justify-content-md-center py-1" style="background-color:#17191c;">';

    for(var j = 0; j < officerEntries.length; j++) {

        // Officer col div
        tabBlock += '<div class="col-md-auto py-2">'; // d-flex align-items-stretch" >';
        // Officer Card div
        tabBlock += '<div class="card h-100 mb-3 bg-dark text-white" style="width: 15rem;">'

        // Card header
        tabBlock += '<div class="card-header">' + officerEntries[j].role + '</div>'
        // Card image
        if (officerEntries[j].image == "N/A") {
            tabBlock += '<img class="img-fluid" src="../images/OldOfficerPics/blank.png" alt="' +
                officerEntries[j].name + '" style="width: 100%">';

        } else if(officerEntries[j].image == "BLANK"){
            // Empty image
        }else {
            tabBlock += '<img class="img-fluid" src="' + officerEntries[j].image + '" alt="' +
                officerEntries[j].name + '" style="width: 100%">';
        }


        // Card body div
        tabBlock += '<div class="card-body"style="width: 15rem;">';
        // Card body title
        tabBlock += '<h5 class="card-title">' + officerEntries[j].name + '</h5>';
        // Card body desc.
        if (officerEntries[j].desc != "N/A") {
            tabBlock += '<p class="card-text">' + officerEntries[j].desc + '\n</p>';
            tabBlock += '<p class="card-text">' + officerEntries[j].educ + '</p>';
        }

        // Card body /div
        tabBlock += '</div>';

        //Card email and linkedin
        if((officerEntries[j].email || officerEntries[j].linkedin) != "N/A") {
            tabBlock += '<div class="card-footer " style="width: 15rem;">';
            if (officerEntries[j].email != "N/A") {
                tabBlock += '<a href="mailto:' + officerEntries[j].email + '" class="btn btn-primary float-left">Email</a>';
            }

            if (officerEntries[j].linkedin != "N/A") {
                tabBlock += '<a href="' + officerEntries[j].linkedin + '" class="btn btn-primary float-right">LinkedIn</a>';
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
    officerContents.innerHTML += tabBlock;

};