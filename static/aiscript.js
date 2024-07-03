window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

let texts = document.querySelector(".texts"); // Get the element.
const recognition = new SpeechRecognition(); // Getting Speech Recognition api
recognition.interimResults = true; // Browser corrects user's spelling mistakes and finalizes them.
recognition.lang = "th-TH"; // Language

// If localStorage has 'previousChatForAIByShu-vro' item, get it. Or set the array to null.
let textArray = localStorage.getItem("previousChatForAIByShu-vro")
    ? JSON.parse(localStorage.getItem("previousChatForAIByShu-vro"))
    : [];
if (!localStorage.getItem("previousChatForAIByShu-vro")) {
    // Setting Item to local storage.
    localStorage.setItem(
        "previousChatForAIByShu-vro",
        JSON.stringify(textArray)
    );
}

// Loading previous Chats.
class PastChat {
    constructor(text) {
        this.text = text;
        if (this.text.includes("repl.")) {
            this.text = this.text.replace("repl.", "");
            this.reply();
        } else if (
            text.includes("https://en.wikipedia.org/w/index.php?search=")
        ) {
            this.panel();
        } else {
            this.comment();
        }
        
    }
    // The comment generator function
    comment() {
        let p = document.createElement("p");
        p.innerText = this.text;
        texts.appendChild(p);
        console.log(this.text); 
    }
    // The reply generator function
    reply() {
        let p = document.createElement("p");
        p.classList.add("reply");
        p.innerText = this.text;
        texts.appendChild(p);
    }
    // The iframe generator function
    panel() {
        let iframe = document.createElement("iframe");
        iframe.src = this.text;
        texts.appendChild(iframe);
    }
}

// For each text in the textArray...
for (let i = 0; i < textArray.length; i++) {
    const text = textArray[i];
    new PastChat(text);
    
}

let p = document.createElement("p");
recognition.addEventListener("result", (e) => {
    texts.appendChild(p);

    let text = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

    p.textContent = text;
    //console.log(text);
    if (e.results[0].isFinal) {
        textArray.push(text); // Push the text to the text array.
        localStorage.setItem(
            "previousChatForAIByShu-vro",
            JSON.stringify(textArray) // Stringify the text array
            
        );
        console.log(textArray[textArray.length-1]); //Get the final speech text detection  
        //Fetch the data of the text listening to the back-end server to processing the Large Language model function 
        var final_text = textArray[textArray.length-1]; //Get the final text pricessing data to send back into the back-end server 
        fetch('/assistant_text_resp', {

            // Declare what type of data we're sending
            headers: {
              'Content-Type': 'application/json'
            },
        
            // Specify the method
            method: 'POST',
        
            // A JSON payload
            body: JSON.stringify({
                "text": String(final_text)
            })
        }).then(function (response) { // At this point, Flask has printed our JSON
          return response.text();
        }).then(function (text) {
            console.log('POST response: ');
            // Should be 'OK' if everything was successful
            var assist_json = JSON.parse(text);
            console.log(assist_json);
            document.getElementById('ref_text').value = assist_json['text']
            
        });
        //Processing the text and category of the data processing to send the right feature of the Large Language model and the other function processing   
        if (text.includes(final_text)) {
            //Fetch the data in here 
            p = document.createElement("p");
            p.classList.add("reply");
            p.innerText = "Manufacturing Assistant: "+String(document.getElementById('ref_text').value);
            texts.appendChild(p);
            //textArray.push("repl.I am fine");
            localStorage.setItem(
                "previousChatForAIByShu-vro",
                JSON.stringify(textArray)
            );
        } 
        
        
        var speaker = window.speechSynthesis;
        function speakFunction() {
            var toSpeak = new SpeechSynthesisUtterance(p.textContent);
            var voices = speaker.getVoices();
            toSpeak.voice = voices[3]; // 0 to 20
            toSpeak.pitch = 1; // 0 to 2
            toSpeak.rate = 1; // 0.1 to 10
            toSpeak.volume = 1; // 0 to 1
            toSpeak.lang = "th-TH";
            speaker.speak(toSpeak);
        }
        //speakFunction();
        p = document.createElement("p");
        // Else Will be coming soon...
        // else {
        //     p = document.createElement("p");
        //     p.classList.add("reply");
        //     p.textContent =
        //         "Sorry, I couldn't understand you. Please speak in English or say 'help' to know my commands. Thank you.";
        //     texts.appendChild(p);
        // }
        window.scrollBy(0, 10000);
    }
});

// When the recognition is ended, it starts again.
recognition.addEventListener("end", () => {
    recognition.start();
});

// Starting the recognition.
recognition.start();