var writingModeActive = true;
var uploadModeActive = false;


let prevScrollPos = window.scrollY; // Use scrollY instead of pageYOffset
const nav = document.querySelector('.mainNav');
nav.style.position = 'absolute';

window.onscroll = function() {
    const currentScrollPos = window.scrollY; // Use scrollY instead of pageYOffset
    if (prevScrollPos > currentScrollPos) {
        nav.style.top = '0';
        nav.style.position = 'fixed';
    } else {
        nav.style.position = 'absolute';
    }
    if(window.scrollY < 55){
        nav.style.backgroundColor = 'transparent';
        nav.style.boxShadow = 'none';
    } else{
        nav.style.backgroundColor = 'white';
        nav.style.boxShadow = '1px 1px 15px rgba(102, 51, 153, 0.558)';
    }
    prevScrollPos = currentScrollPos;
};





var textArea = document.getElementById("text");
var textContentArea = document.querySelector(".textContentArea");

textContentArea.addEventListener("input", function(){
    setInterval(countUploadedText, 100);
});


var count = document.getElementById("count");
count.addEventListener("click", (e) => {
    var characters = document.getElementById("characters");
    var words = document.getElementById("words");
    var text = document.getElementById("text").value.trim();
    if(text){


    var wordCount = text.split(/\s+/).filter(function (word) {
        return word.length > 0;
    }).length;

    words.innerHTML = characters.innerHTML = `<span class="loader"></span>`;
    setTimeout(()=>{
        words.innerHTML = wordCount;
        characters.innerHTML = text.replace(/\s/g, "").length;
    }, 1000);
    }

    else {
        alert("Please type something or paste an item to count!")
    }
});



var countDocument = document.querySelector(".countDocument");
countDocument.addEventListener("click", (e) => {
    var characters = document.querySelector(".uploadedTextCharacters");
    var words = document.querySelector(".uploadedTextWords");
    var text = document.querySelector(".textContentArea").textContent.trim();
    if(text){


    var wordCount = text.split(/\s+/).filter(function (word) {
        return word.length > 0;
    }).length;

    words.innerHTML = characters.innerHTML = `<span class="loader"></span>`;
    setTimeout(()=>{
        words.innerHTML = wordCount;
        characters.innerHTML = text.replace(/\s/g, "").length;
    }, 1000);
    }

    else {
        alert("Please upload an item to count!")
    }
});




    
    function uploadItem() {
        var input = document.querySelector(".uploadDrop input");
        var file = input.files[0]; // Get the first file selected by the user
        handleFile(file);
        document.title = "File | "+file.name;
    }
    
    function handleFile(file) {
        if (file) {
            var uploadContainer = document.querySelector(".uploading");
            var documentName = document.querySelector(".documentName");
            var accept = document.querySelector("#accept");
            uploadContainer.style.display = "block";

            documentName.textContent = "File name: " + file.name;

            setTimeout(() => {
                accept.textContent = file.name+ ".✔️ Size: " + (file.size/1000).toFixed(0)+"Kb.";
                uploadContainer.style.display = "none";
                countUploadedText();
            }, 4500);
            textContentArea.textContent = "Uploading document! Please wait...";


            var reader = new FileReader();
            reader.onload = function(event) {
                // Once the file is loaded, extract the content using mammoth
                var arrayBuffer = reader.result;
                mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, { includeDefaultStyleMap: true })                    .then(function(result) {
                        var text = result.value;
                        //console.log(text);
                        setTimeout(() => {
                            textContentArea.setAttribute("contenteditable", "true");
                            textContentArea.innerHTML = text;
                            countUploadedText();
                        }, 3500);
                    })
                    .catch(function(err) {
                        console.log("Error extracting text:", err);
                    });
            };
            reader.readAsArrayBuffer(file);
            
            writingModeActive = false;
            uploadModeActive = true;

            countUploadedText();
        } else {
            alert("No file selected.");
        }
    }
   











    function downloadWordDocument() {
        var notification = document.createElement("div");
        notification.innerHTML = `
        <div class="alert alert-info">
        <strong class="default"><i class="fa-solid fa-triangle-exclamation"></i> Important! </strong> You may loose some important styling. Please proofread.
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        </div>
      `;
      document.body.appendChild(notification);

      document.querySelector(".close").addEventListener("click", ()=>{
        document.body.removeChild(notification)
      });


      setTimeout(() => {
        document.body.removeChild(notification)
      }, 10000);


    setTimeout(() => {
        var textContent = document.getElementById("text").value;
        var filename = textContent.split(/\s+/).slice(0, 4).join(' ');
        var htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <title>Export HTML To Doc</title>
                </head>
                <style>
                body { line-height: 2; }
                    p { margin-bottom: 10px; }
                </style>
                <body>
                ${textContent.split('\n').map(line => `<p style="line-height: 150%;">${line}</p>`).join('')}                </body>
            </html>`;
    
        var blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    
        // Specify link url
        var url = URL.createObjectURL(blob);
    
        // Specify file name
        filename = filename ? filename + '.doc' : 'Newdocument.doc';
    
        // Create download link element
        var downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
    
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = url;
    
            // Setting the file name
            downloadLink.download = filename;
    
            // Triggering the download
            downloadLink.click();
        }
    
        document.body.removeChild(downloadLink);
    }, 2000);


    }













    function countUploadedText() {
        var text = textContentArea.textContent.trim();

        // Split the text content into words
        var words = text.split(/\s+/);

        // Filter out empty strings
        wordsCount = words.filter(function(word) {
            return word.length > 0;
        }).length;
        document.querySelector(".uploadedTextWords").textContent = wordsCount;
        document.querySelector(".uploadedTextCharacters").textContent = text.replace(/\s/g, "").length;
    }


    

    // Allow drop event
    var dropArea = document.querySelector('.uploadContainer');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;
    
        handleFile(files[0]);
        document.title = "File | "+files[0].name;
    }


    
    var realtime = document.querySelector(".realtimeCounter");
    var realtimeTarget = document.querySelector(".realtimeTarget");
    var percentAllowanceContainer = document.querySelector(".percentAllowanceContainer");
    var percentAllowance = document.querySelector(".percentageAllowance");
    var percentContainer = document.querySelector(".percentage");

    percentAllowanceContainer.style.display = "none";


    realtime.checked = true;
    percentAllowance.checked = true;
    realtimeTarget.checked = false;
    realtime.addEventListener("click", ()=>{
        if(realtime.checked){
            alert("You turned on Reat-time Counter!");

        }
    });

    var target;
    realtimeTarget.addEventListener("click", ()=>{
        if(realtimeTarget.checked){
            target =  prompt("Enter your Target Word Count: \n\n(Must be a number between 10 - 10,000)\n", "");
            if (!isNaN(parseInt(target))) {
                document.querySelector(".target").textContent = parseInt(target) + " Words.";
            } else if (target === "") {
                document.querySelector(".target").textContent = "Please enter a number!";
                realtimeTarget.checked = false;
            } else {
                document.querySelector(".target").textContent = "Please enter a valid number!";
                realtimeTarget.checked = false;
            }
            console.log("Target: ", parseInt(target));
        } else{
            //alert("You turned OFF Reat-time Counter!");
            document.querySelector(".target").textContent = "";
        }
    });
setInterval(() => {
    if(realtimeTarget.checked){
        percentAllowanceContainer.style.display = "block";
        if(percentAllowance.checked){
            var percent = 10;
            percentContainer.textContent = percent+"% ";
        } else {
            var percent = 0.01;
            percentContainer.textContent = percent+"% ";
        };

        document.querySelector(".wordRange").innerHTML = ((100 - percent)/100 * parseInt(target)).toFixed() + ' - '+ ((100 + percent)/100 * parseInt(target)).toFixed();

        textArea.addEventListener('input', function() {
            var text = textArea.value.trim();
            



            var wordCount = text.split(/\s+/).filter(function (word) {
                return word.length > 0;
            }).length;

            console.log("Min: ", ((100 - percent)/100 * parseInt(target)), "Max: ", ((100 + percent)/100 * parseInt(target)) );

            if(wordCount >= ((100 - percent)/100 * parseInt(target)) && wordCount <= ((100 + percent)/100 * parseInt(target)) ){
                document.querySelector("#errorMessage").innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> <b>Kudos!</b>  You are within +/- 10% of your target word count!';
                textArea.style.color = "green";
                document.querySelector("#errorMessage").style.color = "green";
            } else if(wordCount > (parseInt(target) + (parseInt(target)/percent) )) {
                document.querySelector("#errorMessage").innerHTML = '<ion-icon name="alert-circle-outline"></ion-icon> <b>Error</b> You have passed your target count!';
                 textArea.style.color = "red";
                 document.querySelector("#errorMessage").style.color = "red";
            } else {
                textArea.style.color = "black";
                if(wordCount > 0){
                    document.querySelector("#errorMessage").innerHTML = 'Almost there...';

                } else {
                    document.querySelector("#errorMessage").innerHTML = '';

                }
                document.querySelector("#errorMessage").style.color = "black";
            }
        });
    } else {
        percentAllowanceContainer.style.display = "none";
    }
    
}, 1000);


var clearText = document.querySelector('#clear');
var copyText = document.querySelector('#copyDoc');
clearText.addEventListener("click", ()=>{
    if(confirm("Are you sure you want to clear text area?")){
        textArea.value = "";
    }
});
copyText.addEventListener("click", ()=>{
    textArea.select();
    document.execCommand("copy");
});






































setInterval(() => {
    if(realtime.checked){
        textArea.addEventListener("input", ()=>{
            var characters = document.getElementById("characters");
            var words = document.getElementById("words");
            var text = textArea.value.trim();
            if(text){
                var wordCount = text.split(/\s+/).filter(function (word) {
                    
                return word.length > 0;
            }).length;
            console.log(wordCount)
            words.innerHTML = wordCount;
            characters.innerHTML = text.replace(/\s/g, "").length;
            }
        })
        
    } else{
        //
    }
}, 1000);


var modes = document.querySelectorAll(".writingMode button");
modes.forEach(function(writingMode){
    writingMode.addEventListener("click", ()=>{
        modes.forEach(function(writingMode){
            writingMode.classList.remove("activeMode");
        });


        if(writingMode.textContent.includes("Upload")){
            writingModeActive = false;
            uploadModeActive = true;

            textContentArea.textContent = "Upload a word document...";
            //console.log("Mode set to Upload");
        } else {
            writingModeActive = true;
            uploadModeActive = false;
            
            //console.log("Mode set to Writing");
        }
        
        //alert(writingMode.textContent);
        writingMode.classList.add("activeMode");
    });
});


setInterval(()=>{
    if (writingModeActive) {
        //alert("Your are in writing mode!");
        
        document.querySelector(".writingModeActive").style.display = "block";
        document.querySelector(".uploadModeActive").style.display = "none";
        document.title = "Word Counter | Writing Mode";

    } else {
        if(uploadModeActive){
            document.querySelector(".writingModeActive").style.display = "none";
            document.querySelector(".uploadModeActive").style.display = "block";
            //alert("Your are in Uploading mode mode!");
            modes.forEach(function(writingMode){
                modes.forEach(function(writingMode){
                    writingMode.classList.remove("activeMode");
                });

                if(writingMode.textContent.includes("Upload")){
                    writingMode.classList.add("activeMode");
                }
                });
            };
    document.title = "Word Counter | Upload";
    }
}, 100);















var accountBox = document.querySelector("#accountDetails");
var account = document.querySelector("#account");

function showSettings() {
    if (accountBox.style.display !== "block") {
        accountBox.style.display = "block";
        accountBox.style.opacity = "1";
        account.innerHTML = '<ion-icon name="chevron-up-outline"></ion-icon>';
    } else {
        accountBox.style.opacity = "0";
        accountBox.style.display = "none";
        account.innerHTML = '<ion-icon name="person-outline"></ion-icon>';
    }
}
