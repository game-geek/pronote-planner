import express from "express";
import upload  from "./upload";
import multer from "multer";
import cors from "cors";
import { calculate } from "./logic"
import { auth, db } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import path, { join } from "path";
import bodyParser from "body-parser";
import fs from "fs";
import busboy from 'busboy';
import http from "http"
import net from "net"
import { Socket } from "dgram";
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";
// var contentType = require('content-type')
// var getRawBody = require('raw-body')

// const server = http.createServer((req, res) => {
//   // Request handling logic goes here
//   console.log("request")
//   // req.pause()
//   // res.writeHead(200, { 'connection': 'close' });
//   // res.end('something went wrong...');
//   req.pause()
//   res.setHeader("Connection", "close")
//   res.end("error", () => {
//     console.log("ended")
//     req.destroy()
//   })
// });
// server.on('request', (req, res) => {
//   // res.setHeader('Content-Type', 'text/plain');
//   // res.end('Hello, World!\n');
// });
// const port = 8081;
//  server.listen(port, () => {
//      console.log(`Server is listening on port ${port}`);
//  });



// import process from 'node:process';

// // Create an HTTP server
// const server = http.createServer();
// server.on("connection", (client) => {
//   console.log("request")
//   let body:any = ""
//   client.on('data', (chunk) => {
//     console.log('data')
//     body += chunk;
//     if(body.length > 0) {
//       // client.pipe(413);
//       client.end('{"error":"Request exceeded 8mb maximum size."}');
//         process.exit(0);
//     }
// });
// })
// // Now that server is running
// server.listen(8081, '127.0.0.1', () => {
// console.log("listening on port 8081")
// });




const app = express();
app.set('trust proxy', 1)
app.use(compression()); // Compress all routes
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'"],
    },
  }),
);
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);
//Add the client URL to the CORS policy
const whitelist = ["http://localhost:3000", "https://lovely-toys-listen.loca.lt/"];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    // if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    // } else {
      // callback(null, true);
      //callback(new Error("Not allowed by CORS"));
    // }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// // app.use(function(req, res, next)  {
// //   req.on("data",() => {
// //     console.log("data")
// //   })
// //   console.log("request")
// //   let oldSend = res.send;

// //   // res.send = function (data) {

// //   //   logger.info(JSON.parse(data));

// //   //   oldSend.apply(res, arguments);

// //   // }

// //   next();

// // })


app.use(express.json());  

// // app.use(function (req, res, next) {
// //   getRawBody(req, {
// //     length: req.headers['content-length'],
// //     limit: '10mb',
// //     encoding: contentType.parse(req).parameters.charset
// //   }, function (err: any) {
// //     if (err) {
// //       return next(err)
// //     }
// //     next()
// //   })
// // })
app.get('/ip', (request, response) => response.send(request.ip))
// create schedule (creates user and schedule)
app.post("/create_user", async function (req, res) {
  // check if valid data
  // @ts-ignore
  if (!req.body || !req.body.username || req.body.username.length < 3) {
    res.statusCode = 400
    res.send({ code: "invalid username" })
    return
  }

  // generate orgToken (same as user uid)
  const orgToken = uuidv4()

  auth
    .createCustomToken(orgToken)
    .then(async (authToken) => {
      // successfully generated firebase token

      // create org document
      const docRef = db.doc("organisations/"+ orgToken)
      docRef.set({
        free: [],
        username: req.body.username
      }).then(() => {
        res.statusCode = 200
        res.send({ orgToken, authToken })
      }).catch(err => {
        console.log("ERROR WHILE CREATING ORG DOCUMENT", err)
        res.statusCode = 500
        res.send({ code: "Error while creating user" })
      })
    })
    .catch((error) => {
      console.log('ERROR WHILE CREATING FIREBASE AUTH TOKEN', error);
      res.statusCode = 500
      res.send({ code: "Error while creating user" })
    });

})

const MAX_BYTES = 10 * 1024 *1024
// upload file to org
app.post("/upload_file", async function (req, res) {


  
  const form = formidable({ maxFileSize: MAX_BYTES, keepExtensions: true, maxFiles: 1, uploadDir: __dirname + "/uploads", filter: function ({name, originalFilename, mimetype}) {
    // keep only pdfs
    return true
  } });
  form.on('error', (err) => {
    console.log("error", err)
  });
  try {
    const [fields, files] = await form.parse(req)
    console.log("uploaded file", fields, files)


    if (!fields || !files.file || !fields.username || !fields.orgToken || fields.username[0].length < 3 || fields.orgToken[0].length < 10) {
      //If the file is not uploaded, then throw custom error with message: FILE_MISSING
      res.statusCode = 400
      res.end("Invalid Data")
    } else {
        const file = files.file[0];
  
    const path = file.filepath;
      //If the file is uploaded, then send a success response.
      const success = await calculate(path, req.body.username, req.body.orgToken)
      if (typeof success === typeof String()) {
        // @ts-ignore
        throw Error(success)
      } else if (!success) {
        throw Error("GENERIC_ERROR")
      } else {
        res.send({ status: "success" });
      }
    }
    res.json({ fields, files });

  }  catch (err) {
      console.log("erroring")
      res.statusCode = 413
      res.json({code: "File is too large"})
    }
  });


















//   // res.status(403).end();
//   // throw Error("error")
//   // req.on("data", (chunk) => {
//   //   // console.log(chunk)
//   //   req.pause()
//   // })
//   // let paused = false
//   // req.on("pause", () => {
//   //   paused = true
//   //   console.log("paused")
//   //   if (!paused) {
      
//   //   res.statusCode = 300
//   //   res.send()
//   //   }
//   // })
//   // req.pause()
//   // req.on('close', function() {
//   //   res.writeHead(413, {'Content-Type': 'text/plain'});
//   //   res.end('10mb max.');
//   // })
//   // res.statusCode = 300
//   // res.send("error ")
//   // res.end();
//   // res.status(404).end()
//   // var bb = busboy({ headers: req.headers, limits: { fileSize: 1024 } });
//   //   var fileList: any = [];
//   //   bb.on('file', function(fieldname: any, file: any, filename: any, encoding: any, mimetype: any ) {
//   //       let fileInfo = {
//   //           'fObj': file,
//   //           'file': filename,
//   //           'status': 'uploaded'
//   //       }
//   //       fileList.push(fileInfo);
//   //       file.on('limit', function() {
//   //           fileInfo.status = `Size over max limit (${1024} bytes)`;
//   //       });
//   //       file.on('end', function() {
//   //           if (fileInfo.fObj.truncated) {
//   //               if (fileInfo.status === 'uploaded') {
//   //                   // this shouldn't happen
//   //                   console.error(`we didn't get the limit event for ${fileInfo.fObj.file}???`);
//   //                   fileInfo.status = `Size over max limit (${1024} bytes)`;
//   //               }
//   //           }
//   //       });
//   //       file.pipe(fs.createWriteStream(`./uploads/${fileList.length}.bin`));
//   //   });
//   //   bb.on('finish', function() {
//   //       var out = "";
//   //       fileList.forEach((o :any) => {
//   //           out += `<li>${escape(o['file'])} : ${o['status']}</li>`
//   //       });
//   //       res.writeHead(200, {'Connection': 'close'});
//   //       res.end(`<html><body><ul>${out}</ul></body></html>`);
//   //   })
//   //   return req.pipe(bb);


//   // var bb = busboy({
//   //   headers: req.headers,
//   //   limits: {
//   //     files: 1,
//   //     fileSize: 1024 * 1024 * 1
//   //   }
//   // });
//   // var saveTo = path.join(__dirname, 'uploads', Math.random() + '.jpg');

//   // bb.on('file', function(fieldname:any, file:any, filename:any, encoding:any, mimetype:any) {
//   //   // file.on('limit', function() {
//   //     console.log('limit reached!');
//   //     req.unpipe(bb);
//   //     res.writeHead(500, {'Connection': 'close'});
//   //     res.end('Limit Reached');
//   //     req.destroy()
//   //   // });
//   //   // file.pipe(fs.createWriteStream(saveTo));
//   // });
//   // bb.on('finish', function() {
//   //    res.writeHead(200, {'Connection': 'close'});
//   //    res.end();
//   // });

//   // // This doesn't work without piping here, but also always returns 200
//   // return req.pipe(bb);
// // return req.socket.destroy()

//     // req.pause()
//     // res.statusCode = 400;
//     // res.end('upload limit exceeded');
//       // @ts-ignore
//   // var path = path + "/uploads"
//   //   var maxSize = 3146000; // 3MB

//   //   var options = {uploadDir: path};
//   //   var form = formidable()

//   //   form.on('error', function(message) {
//   //       // res.statusCode = 413;
//   //       // res.send('Upload too large');
//   //       // res.end();
//   //   });


//   //   form.on('fileBegin', (formname, file) => {
//   //     // this.emit("error")
//   //     // @ts-ignore
//   //     form._error("error 101")
//   //   });

//   //   try {
//   //       const [fields, files] = await form.parse(req);

//   //   } catch (err: any) {
//   //       // example to check for a very specific error
//   //       console.error(err);
//   //       // req.socket.end();
//   //       // req.destroy()
//   //       // res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        
//   //       // console.error("ned");
//   //       // return res.end(String(err));;
//   //   }
//   //   // return res.end(String("dd"));;
//   // socket.setTimeout(0)
//   // console.log(req.emit('close'))
//   // res.sendStatus(404).end();
//   //  req.socket.end();
//   //  return res.end();
//   // req.socket._destroy("eer", (er) => {console .log(er)})
  
//   // res.status(500).send('some error')
//     // res.json({ fields, files });
//     // req.destroy()
//     // return res.end();












// //   const form = formidable({ maxFileSize: 1024 * 1024 * 0, filter: function ({name, originalFilename, mimetype}) {
// //     // keep only images
// //     console.log("destroying...")
// //     // req.destroy()
// //     return false;
// //   } });
// //   form.on('error', (err) => {
// //     console.log("error", err)
// //   });
// //   form.on ('progress', function (bytesReceived, bytesExpected) {
// //     //console.log (bytesReceived, bytesExpected);
// //     if (bytesReceived > 1 *1024 *1024)
// //     {
// //         console.log ('*** TOO BIG');

// //         // ***HACK*** see Formidable lib/incoming_form.js
// //         // forces close files then triggers error in form.parse below
// //         // bonus: removes temporary files
// //         // --> use throttling in Chrome while opening /tmp in nautilus
// //         //     and watch the files disappear
// //         // form.__2big__ = true;
// //         // @ts-ignore
// //         form._error (new Error ('too big'));
// //         // req.destroy()

// //         //req.connection.destroy (); --- moved to form.parse
// //     }
// // });
// //   form.parse(req, (err, fields, files) => {
// //     if (err) {
// //       res.statusCode = 400
// //       res.send("error")
// //       return;
// //     }
// //     res.json({ fields, files });
// //   });
//   // form.removeAllListeners()
  
//   // res.statusCode = 400
//   // res.send("bitch error")
    
//   //   // Check if multiple files or a single file
//   // if (!files.myFile.length) {
//   //   //Single file

//   //   const file = files.myFile;

//   //   // checks if the file is valid
//   //   const isValid = isFileValid(file);

//   //   // creates a valid name by removing spaces
//   //   const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

//   //   if (!isValid) {
//   //     // throes error if file isn't valid
//   //     return res.status(400).json({
//   //       status: "Fail",
//   //       message: "The file type is not a valid type",
//   //     });
//   //   }
//   //   try {
//   //     // renames the file in the directory
//   //     fs.renameSync(file.path, join(uploadFolder, fileName));
//   //   } catch (error) {
//   //     console.log(error);
//   //   }

//   //   try {
//   //     // stores the fileName in the database
//   //     return res.status(200).json({
//   //       status: "success",
//   //       message: "File created successfully!!",
//   //     });
//   //   } catch (error) {
//   //     res.json({
//   //       error,
//   //     });
//   //   }
//   // } else {
//   //   // Multiple files
//   // }




//   // try {
//   //   if (!req.file || !req.body.username || req.body.username.length < 3 || !req.body.orgToken) {
//   //     //If the file is not uploaded, then throw custom error with message: FILE_MISSING
//   //     throw Error("File is missing");
//   //   } else {
//   //       const file = req.file;
  
//   //   const path = "uploads/" + file.filename;
//   //     //If the file is uploaded, then send a success response.
//   //     const success = await calculate(path, req.body.username, req.body.orgToken)
//   //     if (typeof success === typeof String()) {
//   //       // @ts-ignore
//   //       throw Error(success)
//   //     } else if (!success) {
//   //       throw Error("GENERIC_ERROR")
//   //     } else {
//   //       res.send({ status: "success" });
//   //     }
//   //   }
//   // } catch (error: any) {
//   //   if (error.message == 'GENERIC_ERROR') {
//   //     res.statusCode = 500
//   //     res.send({ code: "Error while uploading the schedule" })
//   //   } else {
//   //     res.statusCode = 400
//   //     res.send({ code: error.message })
//   //   }
//   // }
// // });

// // app.use((req, res, next) => {
// 	// const form = formidable({maxFileSize: 2.5*1024*1024, uploadDir: uploadDirectory});
// 	// form.parse(req, (err, body, files) => {
// 	// 	if (err)
// 	// 		return next(err);
// 	// 	Object.assign(req, {body, files});
// 	// 	next();
// 	// });
// // });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/index.html'));
//   // res.send(`
//   // <form action="/upload_file" enctype="multipart/form-data" method="POST">
//   //   <input type="file" class="admin__input" id="myFile" name="myFile" />
//   //   <input class="admin__submit" type="submit" />
//   // </form>
//   // `)
// })
// //Express Error Handling
// app.use(function (err: any, res: any) {
//   // Check if the error is thrown from multer
//   // if (err instanceof multer.MulterError) {
//   //   res.statusCode = 400;
//   //   res.send({ code: err.code });
//   // } else if (err) 
//   //   // If it is not multer error then check if it is our custom error for FILE_MISSING & INVALID_TYPE
//   //   if (err.message === "FILE_MISSING" || err.message === "INVALID_TYPE") {
//   //     res.statusCode = 400;
//   //     res.send({ code: err.message });
//   //   } else if (err.message === "INVALID_PDF") {
//   //     res.statusCode = 400;
//   //     res.send({ code: "INVALID_PDF" });
      
//   //   }  else {
//   //     console.log(err)
//   //     //For any other errors set code as GENERIC_ERROR
//   //     res.statusCode = 500;
//   //     res.send({ code: "GENERIC_ERROR" });
//   //   }   
  
// });

const conn: any = {}
//Start the server in port 8081
const server = app.listen(8081, function () {
  // @ts-ignore
  const port = server.address().port;

  console.log("App started at http://localhost:%s", port);
});

