// Converts csv files to json5 files.

// Learning Page resources conversion
const csv = require('csv-parser');
const fs = require('fs');


generateOfficers();


// Basic class used for handling year and officer data.
class yearEntry{

    constructor(yearEntry) {
        this.year = yearEntry;
        this.contentID = "Content" + this.year.replace(/\s/g, '');
        this.tabID = "ID" + this.year.replace(/\s/g, '');
        this.officerEntries = [];
    }    addEntry(dataEntry){
        // Parse data over...
        // Change data image for rest api
        var newOfficer = {name:dataEntry.name, role:dataEntry.role, image:dataEntry.image,
            educ:dataEntry.education, desc:dataEntry.officerDesc, email:dataEntry.email, linkedin:dataEntry.linkedin};
        this.officerEntries.push(newOfficer);
    }

}

function generateOfficers(){
    // Read in learning data with d3 (let this be the only function processed for clarity)
    // Parse csv lines into headers and learning resource data
    var yearEntries = [];
    var workingYear = {};

    fs.createReadStream('../../miscContent/OfficerProfiles.csv')
        .pipe(csv())
        .on('data', (data) => {

            // Parse csv lines into headers and officer data
            if (data.desc == "YEAR") { // Year category entry
                if (Object.keys(workingYear).length != 0) {
                    yearEntries.push(workingYear);
                }
                workingYear = new yearEntry(data.name);


            } else { // Officer entry (can add more categories if needed later)
                workingYear.addEntry(data);

            }

            // yearEntries.push(workingYear);

        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            // Convert to json5 file
            test = 0
            const saveFile = './content/officerProfiles.json5'

            var officerResources = JSON.stringify(yearEntries, null, 4)

            fs.writeFileSync(saveFile,officerResources);

        });

    // d3.csv("../miscContent/OfficerProfiles.csv").then((data) => {
    //
    //     // Parse csv lines into headers and officer data
    //     var yearEntries = [];
    //     var workingYear = {};
    //     for (var i = 0; i < data.length; i++) {
    //
    //
    //         if (data[i].desc == "YEAR") { // Year category entry
    //             if (Object.keys(workingYear).length != 0) {
    //                 yearEntries.push(workingYear);
    //             }
    //             workingYear = new yearEntry(data[i].name);
    //
    //
    //         } else { // Officer entry (can add more categories if needed later)
    //             workingYear.addEntry(data[i]);
    //
    //         }
    //
    //     }
    //     yearEntries.push(workingYear);
    //
    // })

}






// generateLearning();
// generateCourses();

// // Basic class used for handling learning resource data.
// class learningEntry{
//
//     // Generate tab and content IDs for handling nav javascript
//     constructor(learningEntry) {
//         this.learning = learningEntry;
//         this.contentID = "Content" + this.learning.replace(/\s/g, '');
//         this.tabID = "ID" + this.learning.replace(/\s/g, '');
//         this.learningEntries = [];
//     }
//
//     // Convert data over...
//     addEntry(dataEntry){
//         var newData = {name:dataEntry.name, site:dataEntry.site};
//         this.learningEntries.push(newData);
//     }
//
// }
//
// // Basic class used for handling the Missouri S&T course data.
// class classEntry{
//
//     // Generate tab and content IDs for handling nav javascript
//     constructor(catEntry) {
//         this.class = catEntry;
//         this.contentID = "Content" + this.class.replace(/\s/g, '');
//         this.tabID = "ID" + this.class.replace(/\s/g, '');
//         this.classEntries = [];
//     }
//
//     addEntry(dataEntry){
//         // Convert data over...
//         var newData = {course:dataEntry.course,year:dataEntry.year,title:dataEntry.title,details:dataEntry.details,level:dataEntry.level};
//         this.classEntries.push(newData);
//     }
//
// }
//
// // Generate content for both navs upon load of /learn/
//
//
// // Calls the d3 csv read function and parses/generates entries for the learning resources.
// function generateLearning(){
//     // Read in learning data with d3 (let this be the only function processed for clarity)
//     // Parse csv lines into headers and learning resource data
//     var catEntries = [];
//     var workingSite = {};
//
//     fs.createReadStream('../miscContent/learningResources.csv')
//         .pipe(csv())
//         .on('data', (row) => {
//
//             if(row.desc == "CAT"){ // Year category entry
//                 if(Object.keys(workingSite).length != 0) {
//                     catEntries.push(workingSite);
//                 }
//                 workingSite = new learningEntry(row.name);
//
//             }else{ // Resource entry (can add more categories if needed later)
//                 workingSite.addEntry(row);
//             }
//
//         })
//         .on('end', () => {
//             console.log('CSV file successfully processed');
//             catEntries.push(workingSite);
//             // Convert to json5 file
//             test = 0
//             const saveFile = './genContent/content/learningResources.json5'
//
//             var learningResources = JSON.stringify(catEntries, null, 4)
//
//             fs.writeFileSync(saveFile,learningResources);
//
//         });
//
// }
//
// // Calls the d3 csv read function and parses/generates entries for the course resources.
// function generateCourses(){
//     // Read in learning data with d3 (let this be the only function processed for clarity)
//     var catEntries = [];
//     var workingClass = {};
//
//     fs.createReadStream('../miscContent/secClasses.csv')
//         .pipe(csv())
//         .on('data', (row) => {
//             if(row.desc == "CAT"){ // Year category entry
//                 if(Object.keys(workingClass).length != 0) {
//                     catEntries.push(workingClass);
//                 }
//                 workingClass = new classEntry(row.course);
//
//             }else{ // Class entry (can add more categories if needed later)
//                 workingClass.addEntry(row);
//             }
//         })
//         .on('end', () => {
//             console.log('CSV file successfully processed');
//             catEntries.push(workingClass);
//             // Convert to json5 file
//             const saveFile = './genContent/content/secClasses.json5'
//
//             var learningResources = JSON.stringify(catEntries, null, 4)
//
//             fs.writeFileSync(saveFile,learningResources);
//
//         });
//
// }
