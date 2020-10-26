
function loadReg(){
    var xhr= new XMLHttpRequest();
    xhr.open('GET', 'https://acmsec.mst.edu', true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return; // or whatever error handling you want
        var myWindow = window.open("", "myWindow", "width=200,height=100");
        myWindow.document.write(this.responseText);
        // myWindow.opener.document.write("<p>This is the source window!</p>");
        // document.getElementById('y').innerHTML= this.responseText;
    };
    xhr.send();
}
