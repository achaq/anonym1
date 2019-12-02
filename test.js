
const tesseract = require("node-tesseract-ocr");
const fs = require('fs')
const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}
let words = '';
fs.readdir("/home/achaq/Leyton/Nodejs/anonym1/images/1575299250746/",  async function(err, files) {


    for (let file of files) {
        tesseract.recognize("/home/achaq/Leyton/Nodejs/anonym1/images/1575299250746/" + file, config)
            .then(text => {
                words = words + text;
                console.log(words)
                console.log('inside the foreach ')

            })
            .catch(error => {
                console.log(error.message)
            })

    }
    // console.log(words);

});

