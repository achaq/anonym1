const fs = require('fs');
const express = require('express'),
path = require('path'),
cors = require('cors'),
multer = require('multer'),
bodyParser = require('body-parser');
const async = require('async');
let {PythonShell} = require('python-shell')

let name_file='achaq';
const PATH = __dirname+'/uploads';
let time;
const config = {
    lang: "eng",
    oem: 1,
    psm: 3,

}
'use strict';
var Promise = require('bluebird');

var uid = require('uid-safe');
// const sharp = require('sharp');
const gm = require('gm').subClass({imageMagick: true});;
Promise.promisifyAll(gm.prototype);
const tesseract = require("node-tesseract-ocr");
// Express settings
const app = express();
let words = '';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



const PDF2Pic = require("pdf2pic");
const {sync} = require("uid-safe");


let pdf2pic;

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

app.get('/anonym/:thispath/', function(req, res, next)
{
    var strUid = uid.sync(18);
    console.log(req.params.thispath);
    console.log('we are her');
    fs.readFile("./uploads/doc-"+req.params.thispath+"_anonym.pdf", function(err, data) {
        // fs.readFile("/home/achaq/Leyton/Nodejs/anonym1/images/image_4.png", function(err, data) {
        if (err) console.log(err); // Fail if the file can't be read.
        res.writeHead(200, {'Content-Type': 'application/pdf'});
        res.end(data); // Send the file data to the browser.
    });
});


const {promisify} = require('util')

async function filefunction(files, req) {
    const W = req.body.W ,
        H = req.body.H ,
        X = req.body.X ,
        Y = req.body.Y,
        thispath = req.params.thispath;

    for (let file of files) {
        console.log(file);

        // gm('./images/'+thispath +'/'+file).crop(W , H , X , Y)
        //     .write('./images/'+thispath + '/cropped' +file, (err) => {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             tesseract.recognize('./images/'+ thispath + '/cropped'+file, config)
        //                 .then(text => {
        //                     words = words + ' '+ text
        //                     // console.log(words)
        //                     console.log('inside the foreach ')
        //
        //                 })
        //                 .catch(error => {
        //                     console.log(error.message)
        //                 })
        //         }
        //     });
        const imageRead = gm('./images/'+thispath +'/'+file)
        const imageCropped = imageRead.crop(W , H , X , Y)
        const writePromise = promisify(imageCropped.write)
        try {
            await writePromise.call(imageCropped, './images/'+thispath + '/cropped' +file);
            tesseract.recognize('./images/'+ thispath + '/cropped'+file, config)
                .then(text => {
                    words = words + text;
                    // console.log(words)
                    console.log('inside the foreach ')

                })
                .catch(error => {
                    console.log(error.message)
                })
        } catch (e) {
            console.log(e)
        }
        // console.log(gm_temp)
    }
    console.log('out of the froeach')
    // console.log('words ' + words);
    return words;
}

app.post('/crop_pdf/:thispath/:thispage/:numcrops', function(req, res, next){

    console.log('before reading tje file ')
    fs.readdir('./images/'+req.params.thispath +'/',  async function(err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        words = await filefunction(files , req);

            console.log('normally after calling the crop foreach ')
            console.log('+++++++++++++++++++++++++++++++++++++words : ' + words);
            words = words.replace('\f','?')
        console.log('+++++++++++++++++++++++++++++++++++++words : ' + words);
        words = words.replace('\n','+')
        console.log('+++++++++++++++++++++++++++++++++++++words : ' + words);
        let NumberOfCrops = req.params.numcrops;
        let options = {
                mode: 'text',
                pythonOptions: ['-u'],
                scriptPath: './',
                args: [req.params.thispath,
                        NumberOfCrops,
                    words
                    ]
            };
            console.log('normally after the options')
            PythonShell.run('pythonscript.py', options, function (err, results) {
                if (err) throw err;
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
            });


            return res.send({
                    'success': true,
                'data': 'good'
                }
            )
        // let json = JSON.stringify(words);
            // console.log('we are in the json file : ',words,' json : ',json);

            // fs.writeFile('words.json',json,'utf8',function (err) {
            //     console.log('we are in the callbaack function of creating the json file ');
            //     if(err){
            //         console.log('this is wrong');
            //     }
            //     else {
            //         console.log('we are in the no error part of creating the json file ');
            //         const spawn = require("child_process").spawn;
            //         console.log('end is near ')
            //
            //     }
            // });
        });



    // });

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
