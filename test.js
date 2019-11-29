var PDFImage = require("pdf-image").PDFImage;

var pdfImage = new PDFImage("/home/achaq/36.pdf");
console.log("Start");
pdfImage.convertPage(0).then(function (imagePath) {
    // 0-th page (first page) of the slide.pdf is available as slide-0.png
    console.log("Converted.");
    fs.existsSync("tmp/testpdf-0.png") // => true
}, function (err) {
    console.log(err);
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
