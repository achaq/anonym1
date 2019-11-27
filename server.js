const fs = require('fs')
const express = require('express'),
path = require('path'),
cors = require('cors'),
multer = require('multer'),
bodyParser = require('body-parser');
let name_file='achaq';
const PATH = __dirname+'/uploads';
let time;
var uid = require('uid-safe');

// Express settings
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



const PDF2Pic = require("pdf2pic");


let pdf2pic;

function convert(s,n){

    return "yes"
}

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        time=Date.now()
        name_file = file.fieldname + '-' + time + '.pdf'
        cb(null, file.fieldname + '-' + time+'.pdf')
    }
});
let upload = multer({
    storage: storage
});


app.get('/image/:thispath/:thispage', function(req, res, next)
{
    var strUid = uid.sync(18);
    console.log(req.params.thispath);
    console.log('we are her');
    fs.readFile("./images/"+req.params.thispath+"/image_"+req.params.thispage+".png", function(err, data) {
    // fs.readFile("/home/achaq/Leyton/Nodejs/anonym1/images/image_4.png", function(err, data) {
        if (err) console.log(err); // Fail if the file can't be read.
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(data); // Send the file data to the browser.
    });
});





// POST File
app.post('/api/upload', upload.single('doc'), async function (req, res) {
    if (!req.file) {
        console.log("No file is available!");
        return res.send({
            success: false
        });
    } else {
        let path;
        let image_path;
        console.log('File is available!');
        console.log(req.file);
        path=PATH+'/'+name_file;
        console.log(req.file.path);
        // let s= convert(PATH+'/'+name_file,1)
        pdf2pic = new PDF2Pic({
            density: 100,           // output pixels per inch
            savename: "image",   // output file name
            savedir: "./images/"+time,    // output file location
            format: "png",          // output file format
            size: "1240x1754"         // output size in pixels
        });
        pdf2pic.convertBulk(PATH+'/'+name_file, -1).then((resolve) => {
            // console.log(resolve)
            console.log("image converter successfully!");
            return res.send({
                success: true,
                image_path: time
            });
        });

            // .then(result => {
            //     return res.send({
            //         success: true,
            //         image_path: time
            //     });            })
            // .catch(err => {
            //     console.error(err);
            // })





    }

});


// // Create PORT
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log('Connected to port ' + PORT)
});

// Find 404 and hand over to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
