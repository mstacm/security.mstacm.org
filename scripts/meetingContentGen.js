// NAME: Charles Rawlins
// Func: meetingContentGen.js
// Desc: This script automatically generates the content resource
// for the events.html page from oldMeetingContent.csv and upcomingMeetingContent.csv.

// Basic class used for handling the acm meeting content data.
class contentEntry{

    // Generate tab and content IDs for handling nav javascript
    constructor(contentEntry) {
        this.title = contentEntry.title
        this.date = contentEntry.date
        this.time = contentEntry.time
        this.place = contentEntry.place
        this.abstract = contentEntry.abstract
        this.author = contentEntry.author
        this.biography = contentEntry.biography
    }

}


class yearContentEntry{

    constructor(yearEntry) {
        this.year = yearEntry;
        this.contentID = "Content" + this.year.replace(/\s/g, '');
        this.tabID = "ID" + this.year.replace(/\s/g, '');
        this.conEntries = [];
    }

    addEntry(dataEntry){
        // Parse data over...
        var newContent = {title:dataEntry.title, date:dataEntry.date, time:dataEntry.time,
            author:dataEntry.author, place:dataEntry.place, abstract:dataEntry.abstract,biography:dataEntry.biography};
        this.conEntries.push(newContent);
    }

}

// Generate content for both navs upon load of learningResources.html
// window.onload = generateCurrent();
// window.onload = generateOld();

// Calls the d3 csv read function and parses/generates entries for the current meeting topics.
function generateCurrent(){
    // Read in learning data with d3 (let this be the only function processed for clarity)
    d3.csv("../miscContent/upcomingMeetingContent.csv").then(function(data){

        // Parse csv lines into headers and officer data
        var contentEntries = [];
        var workingSite = {};
        for(var i = 0; i < data.length; i++){
            workingContent = new contentEntry(data[i])
            contentEntries.push(workingContent)
        }

        // Generate content
        var contentBlock = '';
        for(var i = 0; i < contentEntries.length; i++) {

            contentBlock += '<div class="card h-100 my-3 bg-dark text-white" style="width: 50rem;">'
            contentBlock += '<div class="card-header"><h2>'+contentEntries[i].title+'</h2></div>'
            contentBlock += '<div class="card-body">'
            contentBlock += '<p><strong>Presented By: </strong>'+contentEntries[i].author+'</p>'
            contentBlock += '<p><strong>Date: </strong>'+contentEntries[i].date+'</p>'
            contentBlock += '<p><strong>Time: </strong>'+contentEntries[i].time+'</p>'
            contentBlock += '<p><strong>Place: </strong>'+contentEntries[i].place+'</p>'
            contentBlock += '<p><strong>Abstract: </strong>'+contentEntries[i].abstract+'</p>'
            contentBlock += '<p><strong>Biography: </strong>'+contentEntries[i].biography+'</p>'
            contentBlock += '</div>'
            contentBlock += '</div>'
            contentBlock += '</div>'
        }
        let currentContent = document.getElementById('currentContent')
        currentContent.innerHTML += contentBlock

    });

}

// Calls the d3 csv read function and parses/generates entries for the old meeting topics.
function generateOld(){
    // Read in old content data with d3 (let this be the only function processed for clarity)
    d3.csv("../miscContent/oldMeetingContent.csv").then(function(data){

        // Parse csv lines into headers and officer data
        var contentEntries = [];
        var workingContent = {};
        for(var i = 0; i < data.length; i++){

            if(data[i].desc == "YEAR"){ // Year category entry
                if(Object.keys(workingContent).length != 0) {
                    contentEntries.push(workingContent);
                }
                workingContent = new yearContentEntry(data[i].title);

            }else{ // Class entry (can add more categories if needed later)
                workingContent.addEntry(data[i]);
            }

        }
        contentEntries.push(workingContent);

        // Generate content tab html code
        var tabBlock = '';
        for(var i = 0; i < contentEntries.length; i++) {

            tabBlock += '<li class="nav-item py-2">';
            if(i == 0){
                tabBlock += '<a class="nav-link active" id="'+contentEntries[i].tabID+'" data-toggle="tab" href="#' +
                    contentEntries[i].contentID+'" role="tab" aria-controls="'+contentEntries[i].contentID+'" ' +
                    'aria-selected="true">'+contentEntries[i].year+'</a>'
            }else{
                tabBlock += '<a class="nav-link" id="'+contentEntries[i].tabID+'" data-toggle="tab" href="#' +
                    contentEntries[i].contentID+'" role="tab" aria-controls="'+contentEntries[i].contentID+'" ' +
                    'aria-selected="false">'+contentEntries[i].year+'</a>'
            }

            tabBlock += '</li>'

        }
        let contentTab = document.getElementById('contentTab')
        contentTab.innerHTML += tabBlock

        var contentTabContents = document.getElementById('contentTabContent')

        // Generate year tab contents from learning csv file.
        for (var i = 0; i < contentEntries.length; i++){

            tabBlock = "";
            if(i == 0){
                tabBlock += '<div class="tab-pane fade show active" id="'+contentEntries[i].contentID+
                    '" role="tabpanel" aria-labelledby="'+contentEntries[i].tabID+'">';
            }else{
                tabBlock += '<div class="tab-pane fade show" id="'+
                    contentEntries[i].contentID+'" role="tabpanel" aria-labelledby="'+contentEntries[i].tabID+'">';
            }
            tabBlock += '<div class="row d-flex justify-content-md-center mt-2">';

            for(var j=0;j < contentEntries[i].conEntries.length; j++){
                tabBlock += '<div class="card h-100 my-3 bg-dark text-white" style="width: 50rem;">'
                tabBlock += '<div class="card-header"><h2>'+contentEntries[i].conEntries[j].title+'</h2></div>'
                tabBlock += '<div class="card-body">'
                tabBlock += '<p><strong>Presented By: </strong>'+contentEntries[i].conEntries[j].author+'</p>'
                tabBlock += '<p><strong>Date: </strong>'+contentEntries[i].conEntries[j].date+'</p>'
                tabBlock += '<p><strong>Time: </strong>'+contentEntries[i].conEntries[j].time+'</p>'
                tabBlock += '<p><strong>Place: </strong>'+contentEntries[i].conEntries[j].place+'</p>'
                tabBlock += '<p><strong>Abstract: </strong>'+contentEntries[i].conEntries[j].abstract+'</p>'
                tabBlock += '<p><strong>Biography: </strong>'+contentEntries[i].conEntries[j].biography+'</p>'
                tabBlock += '</div>'
                tabBlock += '</div>'

            }
            tabBlock += '</div>'; // Row div
            tabBlock += '</div>'; // tab div

            contentTabContents.innerHTML += tabBlock;

        }
    });

}





