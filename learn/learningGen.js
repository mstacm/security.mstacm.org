/**
 * Learning page content generation script
 *
 * Generates the learning resource links and Missouri S&T class listings for './index.html'. The data
 * is loaded from the backend in '../node/genContent'
 *
 * @file   learningGen.js
 * @author Charles Rawlins
 */

// Generate content for page upon load of /learn/
window.onload = generateData();

/**
* Content generation API call
*
* Calls the data from the site backend for content generation
*/
function generateData(){
    var learnResources;
    var mstCourses;
    // Get learning content from backend
    $.ajax({
        type:'GET',
        url:'http://localhost:3003/learningGen',
        contentType: "application/json",

        success: function(json) {

            learnResources = json['learningResources']
            mstCourses = json['mstCourses']

            generateLearning(learnResources);
            generateCourses(mstCourses);
        },

        error: function() {
            alert("Error! Please refresh and try again!");
        }
    });

}

//

/**
 * Learning resource generator
 *
 * Generates entries for the learning resources.
 */
function generateLearning(learnResources){

        // Generate cat tab html code
        var catBlock = '';
        for(var i = 0; i < learnResources.length; i++) {

            // li entry example:
            // <li class="nav-item">
            //      <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home"
            //      role="tab" aria-controls="home" aria-selected="true">Home</a>
            // </li>

            catBlock += '<li class="nav-item py-2">';
            if(i == 0){
                catBlock += '<a class="nav-link active" id="'+learnResources[i].tabID+'" data-toggle="tab" href="#' +
                    learnResources[i].contentID+'" role="tab" aria-controls="'+learnResources[i].contentID+'" ' +
                    'aria-selected="true">'+learnResources[i].learning+'</a>'
            }else{
                catBlock += '<a class="nav-link" id="'+learnResources[i].tabID+'" data-toggle="tab" href="#' +
                    learnResources[i].contentID+'" role="tab" aria-controls="'+learnResources[i].contentID+'" ' +
                    'aria-selected="false">'+learnResources[i].learning+'</a>'
            }

            catBlock += '</li>'

        }
        let resourceTab = document.getElementById('resourceTab')
        resourceTab.innerHTML += catBlock

        var tabContents = document.getElementById('resourceTabContent')

        // Generate tab contents from learning csv file.
        for (var i = 0; i < learnResources.length; i++){
            // learning resource button example:
            // <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            //     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, eveniet earum.
            //     Sed accusantium eligendi molestiae quo hic velit nobis et, tempora placeat ratione
            //     rem blanditiis voluptates vel ipsam? Facilis, earum!</p>
            // </div>

            tabBlock = "";
            if(i == 0){
                tabBlock += '<div class="tab-pane fade show active" id="'+learnResources[i].contentID +'" role="tabpanel"' +
                    ' aria-labelledby="'+learnResources[i].tabID+'">';
            }else{
                tabBlock += '<div class="tab-pane fade show" id="'+learnResources[i].contentID+'" role="tabpanel" ' +
                    'aria-labelledby="'+learnResources[i].tabID+'">';
            }
            tabBlock += '<div class="row justify-content-md-center mt-2">';

            for(var j=0;j < learnResources[i].learningEntries.length; j++){
                tabBlock += '<a class="btn btn-primary mx-1 my-1" href="'+learnResources[i].learningEntries[j].site +
                    '" target="_blank">'+learnResources[i].learningEntries[j].name+'</a><br/>';
            }
            tabBlock += '</div>'; // Row div
            tabBlock += '</div>'; // tab div

            tabContents.innerHTML += tabBlock;

        }

}

//

/**
 * Course listing generator
 *
 * Generates entries for the course resources
 */
function generateCourses(mstCourses){

        // Generate cat tab html code
        var catBlock = '';
        for(var i = 0; i < mstCourses.length; i++) {

            catBlock += '<li class="nav-item py-2">';
            if(i == 0){
                catBlock += '<a class="nav-link active" id="'+mstCourses[i].tabID+'" data-toggle="tab" href="#' +
                    mstCourses[i].contentID+'" role="tab" aria-controls="'+mstCourses[i].contentID+'" ' +
                    'aria-selected="true">'+mstCourses[i].class+'</a>'
            }else{
                catBlock += '<a class="nav-link" id="'+mstCourses[i].tabID+'" data-toggle="tab" href="#' +
                    mstCourses[i].contentID+'" role="tab" aria-controls="'+mstCourses[i].contentID+'" ' +
                    'aria-selected="false">'+mstCourses[i].class+'</a>'
            }

            catBlock += '</li>'

        }
        let classTab = document.getElementById('classTab')
        classTab.innerHTML += catBlock

        var classTabContents = document.getElementById('classTabContent')

        // Generate year tab contents from learning csv file.
        for (var i = 0; i < mstCourses.length; i++){

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
                tabBlock += '<div class="tab-pane fade show active" id="'+mstCourses[i].contentID+
                    '" role="tabpanel" aria-labelledby="'+mstCourses[i].tabID+'">';
            }else{
                tabBlock += '<div class="tab-pane fade show" id="'+
                    mstCourses[i].contentID+'" role="tabpanel" aria-labelledby="'+mstCourses[i].tabID+'">';
            }
            tabBlock += '<div class="row d-flex justify-content-md-center mt-2">';

            for(var j=0;j < mstCourses[i].classEntries.length; j++){
                // Change background color based on course difficulty level
                switch(mstCourses[i].classEntries[j].level){
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

                tabBlock += '<div class="card-header">'+mstCourses[i].classEntries[j].course+' ('+
                    mstCourses[i].classEntries[j].year+')</div>';
                tabBlock += '<div class="card-body" style="width: 15rem;">';
                tabBlock += '<h5 class="card-title">'+mstCourses[i].classEntries[j].title+'</h5>';
                tabBlock += '<p class="card-text text-black-50">'+mstCourses[i].classEntries[j].details+'</p>';
                tabBlock += '</div>';
                tabBlock += '</div>';
            }
            tabBlock += '</div>'; // Row div
            tabBlock += '</div>'; // tab div

            classTabContents.innerHTML += tabBlock;

        }

}
