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
var contentType = require('content-type')
var getRawBody = require('raw-body')




const app = express();
//Add the client URL to the CORS policy
const whitelist = ["http://localhost:3000", "https://lovely-toys-listen.loca.lt/"];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true);
      //callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(function(req, res, next)  {
//   req.on("data",() => {
//     console.log("data")
//   })
//   console.log("request")
//   let oldSend = res.send;

//   // res.send = function (data) {

//   //   logger.info(JSON.parse(data));

//   //   oldSend.apply(res, arguments);

//   // }

//   next();

// })


// app.use(express.json());  

// app.use(function (req, res, next) {
//   getRawBody(req, {
//     length: req.headers['content-length'],
//     limit: '10mb',
//     encoding: contentType.parse(req).parameters.charset
//   }, function (err: any) {
//     if (err) {
//       return next(err)
//     }
//     next()
//   })
// })

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
const isFileValid = (file: any) => {
  const type = file.type.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png", "pdf"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

const MAX_BYTES = 10 * 1024 *1024
// upload file to org
app.post("/upload_file", async function (req, res) {

  console.log("cool")
  // const form = formidable({ maxFileSize: MAX_BYTES, filter: function ({name, originalFilename, mimetype}) {
  //   // keep only pdfs
  //   return true
  // } });
  // form.on('error', (err) => {
  //   console.log("error", err)
  // });
  // try {
  //   const [fields, files] = await form.parse(req)
  //   res.json({ fields, files });

  // }  catch (err) {
  //     console.log("erroring")
  //     res.statusCode = 413
  //     res.json({code: "File is too large"})
  //   }
  });


















  // res.status(403).end();
  // throw Error("error")
  // req.on("data", (chunk) => {
  //   // console.log(chunk)
  //   req.pause()
  // })
  // let paused = false
  // req.on("pause", () => {
  //   paused = true
  //   console.log("paused")
  //   if (!paused) {
      
  //   res.statusCode = 300
  //   res.send()
  //   }
  // })
  // req.pause()
  // req.on('close', function() {
  //   res.writeHead(413, {'Content-Type': 'text/plain'});
  //   res.end('10mb max.');
  // })
  // res.statusCode = 300
  // res.send("error ")
  // res.end();
  // res.status(404).end()
  // var bb = busboy({ headers: req.headers, limits: { fileSize: 1024 } });
  //   var fileList: any = [];
  //   bb.on('file', function(fieldname: any, file: any, filename: any, encoding: any, mimetype: any ) {
  //       let fileInfo = {
  //           'fObj': file,
  //           'file': filename,
  //           'status': 'uploaded'
  //       }
  //       fileList.push(fileInfo);
  //       file.on('limit', function() {
  //           fileInfo.status = `Size over max limit (${1024} bytes)`;
  //       });
  //       file.on('end', function() {
  //           if (fileInfo.fObj.truncated) {
  //               if (fileInfo.status === 'uploaded') {
  //                   // this shouldn't happen
  //                   console.error(`we didn't get the limit event for ${fileInfo.fObj.file}???`);
  //                   fileInfo.status = `Size over max limit (${1024} bytes)`;
  //               }
  //           }
  //       });
  //       file.pipe(fs.createWriteStream(`./uploads/${fileList.length}.bin`));
  //   });
  //   bb.on('finish', function() {
  //       var out = "";
  //       fileList.forEach((o :any) => {
  //           out += `<li>${escape(o['file'])} : ${o['status']}</li>`
  //       });
  //       res.writeHead(200, {'Connection': 'close'});
  //       res.end(`<html><body><ul>${out}</ul></body></html>`);
  //   })
  //   return req.pipe(bb);


  // var bb = busboy({
  //   headers: req.headers,
  //   limits: {
  //     files: 1,
  //     fileSize: 1024 * 1024 * 1
  //   }
  // });
  // var saveTo = path.join(__dirname, 'uploads', Math.random() + '.jpg');

  // bb.on('file', function(fieldname:any, file:any, filename:any, encoding:any, mimetype:any) {
  //   // file.on('limit', function() {
  //     console.log('limit reached!');
  //     req.unpipe(bb);
  //     res.writeHead(500, {'Connection': 'close'});
  //     res.end('Limit Reached');
  //     req.destroy()
  //   // });
  //   // file.pipe(fs.createWriteStream(saveTo));
  // });
  // bb.on('finish', function() {
  //    res.writeHead(200, {'Connection': 'close'});
  //    res.end();
  // });

  // // This doesn't work without piping here, but also always returns 200
  // return req.pipe(bb);
// return req.socket.destroy()

    // req.pause()
    // res.statusCode = 400;
    // res.end('upload limit exceeded');
      // @ts-ignore
  // var path = path + "/uploads"
  //   var maxSize = 3146000; // 3MB

  //   var options = {uploadDir: path};
  //   var form = formidable()

  //   form.on('error', function(message) {
  //       // res.statusCode = 413;
  //       // res.send('Upload too large');
  //       // res.end();
  //   });


  //   form.on('fileBegin', (formname, file) => {
  //     // this.emit("error")
  //     // @ts-ignore
  //     form._error("error 101")
  //   });

  //   try {
  //       const [fields, files] = await form.parse(req);

  //   } catch (err: any) {
  //       // example to check for a very specific error
  //       console.error(err);
  //       // req.socket.end();
  //       // req.destroy()
  //       // res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        
  //       // console.error("ned");
  //       // return res.end(String(err));;
  //   }
  //   // return res.end(String("dd"));;
  // socket.setTimeout(0)
  // console.log(req.emit('close'))
  // res.sendStatus(404).end();
  //  req.socket.end();
  //  return res.end();
  // req.socket._destroy("eer", (er) => {console .log(er)})
  
  // res.status(500).send('some error')
    // res.json({ fields, files });
    // req.destroy()
    // return res.end();












//   const form = formidable({ maxFileSize: 1024 * 1024 * 0, filter: function ({name, originalFilename, mimetype}) {
//     // keep only images
//     console.log("destroying...")
//     // req.destroy()
//     return false;
//   } });
//   form.on('error', (err) => {
//     console.log("error", err)
//   });
//   form.on ('progress', function (bytesReceived, bytesExpected) {
//     //console.log (bytesReceived, bytesExpected);
//     if (bytesReceived > 1 *1024 *1024)
//     {
//         console.log ('*** TOO BIG');

//         // ***HACK*** see Formidable lib/incoming_form.js
//         // forces close files then triggers error in form.parse below
//         // bonus: removes temporary files
//         // --> use throttling in Chrome while opening /tmp in nautilus
//         //     and watch the files disappear
//         // form.__2big__ = true;
//         // @ts-ignore
//         form._error (new Error ('too big'));
//         // req.destroy()

//         //req.connection.destroy (); --- moved to form.parse
//     }
// });
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       res.statusCode = 400
//       res.send("error")
//       return;
//     }
//     res.json({ fields, files });
//   });
  // form.removeAllListeners()
  
  // res.statusCode = 400
  // res.send("bitch error")
    
  //   // Check if multiple files or a single file
  // if (!files.myFile.length) {
  //   //Single file

  //   const file = files.myFile;

  //   // checks if the file is valid
  //   const isValid = isFileValid(file);

  //   // creates a valid name by removing spaces
  //   const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

  //   if (!isValid) {
  //     // throes error if file isn't valid
  //     return res.status(400).json({
  //       status: "Fail",
  //       message: "The file type is not a valid type",
  //     });
  //   }
  //   try {
  //     // renames the file in the directory
  //     fs.renameSync(file.path, join(uploadFolder, fileName));
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   try {
  //     // stores the fileName in the database
  //     return res.status(200).json({
  //       status: "success",
  //       message: "File created successfully!!",
  //     });
  //   } catch (error) {
  //     res.json({
  //       error,
  //     });
  //   }
  // } else {
  //   // Multiple files
  // }




  // try {
  //   if (!req.file || !req.body.username || req.body.username.length < 3 || !req.body.orgToken) {
  //     //If the file is not uploaded, then throw custom error with message: FILE_MISSING
  //     throw Error("File is missing");
  //   } else {
  //       const file = req.file;
  
  //   const path = "uploads/" + file.filename;
  //     //If the file is uploaded, then send a success response.
  //     const success = await calculate(path, req.body.username, req.body.orgToken)
  //     if (typeof success === typeof String()) {
  //       // @ts-ignore
  //       throw Error(success)
  //     } else if (!success) {
  //       throw Error("GENERIC_ERROR")
  //     } else {
  //       res.send({ status: "success" });
  //     }
  //   }
  // } catch (error: any) {
  //   if (error.message == 'GENERIC_ERROR') {
  //     res.statusCode = 500
  //     res.send({ code: "Error while uploading the schedule" })
  //   } else {
  //     res.statusCode = 400
  //     res.send({ code: error.message })
  //   }
  // }
// });

// app.use((req, res, next) => {
	// const form = formidable({maxFileSize: 2.5*1024*1024, uploadDir: uploadDirectory});
	// form.parse(req, (err, body, files) => {
	// 	if (err)
	// 		return next(err);
	// 	Object.assign(req, {body, files});
	// 	next();
	// });
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
  // res.send(`
  // <form action="/upload_file" enctype="multipart/form-data" method="POST">
  //   <input type="file" class="admin__input" id="myFile" name="myFile" />
  //   <input class="admin__submit" type="submit" />
  // </form>
  // `)
})
//Express Error Handling
app.use(function (err: any, res: any) {
  // Check if the error is thrown from multer
  // if (err instanceof multer.MulterError) {
  //   res.statusCode = 400;
  //   res.send({ code: err.code });
  // } else if (err) 
  //   // If it is not multer error then check if it is our custom error for FILE_MISSING & INVALID_TYPE
  //   if (err.message === "FILE_MISSING" || err.message === "INVALID_TYPE") {
  //     res.statusCode = 400;
  //     res.send({ code: err.message });
  //   } else if (err.message === "INVALID_PDF") {
  //     res.statusCode = 400;
  //     res.send({ code: "INVALID_PDF" });
      
  //   }  else {
  //     console.log(err)
  //     //For any other errors set code as GENERIC_ERROR
  //     res.statusCode = 500;
  //     res.send({ code: "GENERIC_ERROR" });
  //   }   
  
});

const conn: any = {}
//Start the server in port 8081
const server = app.listen(8082, function () {
  // @ts-ignore
  const port = server.address().port;

  console.log("App started at http://localhost:%s", port);
});

  // client.on('data', (chunk) => {
  //   console.log("chunk")
  //   const data = chunk.toString()
  //     // new request with headers

  //     let reqBuffer = new Buffer('');
  //   // Set up a temporary buffer to read in chunks
  //   let buf: any;
  //   let reqHeader: any;
  //     // Read data from the socket
  //     buf = chunk

  //     // Concatenate existing request buffer with new data
  //     reqBuffer = Buffer.concat([reqBuffer, buf]);

  //     // Check if we've reached \r\n\r\n, indicating end of header
  //     let marker = reqBuffer.indexOf('\r\n\r\n')
  //     if (marker !== -1) {
  //       // If we reached \r\n\r\n, there could be data after it. Take note.
  //       let remaining = reqBuffer.slice(marker + 4);
  //       // The header is everything we read, up to and not including \r\n\r\n
  //       reqHeader = reqBuffer.slice(0, marker).toString();
  //       // This pushes the extra data we read back to the socket's readable stream
  //       console.log(`Request header:\n${reqHeader}`);

  //   // 
  //   // 
  //    /* Request-related business */
  //     // Start parsing the header
  //     const reqHeaders = reqHeader.split('\r\n');
  //     // First line is special
  //     const reqLine = reqHeaders.shift().split(' ');
  //     // Further lines are one header per line, build an object out of it.
  //     const headers = reqHeaders.reduce((acc: any, currentHeader: any) => {
  //       const [key, value] = currentHeader.split(':');
  //       return {
  //         ...acc,
  //         [key.trim().toLowerCase()]: value.trim()
  //       };
  //     }, {});
  //     console.log("requ hearders parsed, ", reqHeaders)
  //     const newHeaders: any = {}
  //     reqHeaders.forEach((h:any) => {
  //       let a = h.split(":")
  //       let first = a[0]
  //       let second = ""
  //       for (let i=1; i < a.length; i++) {
  //         if (!(i == a.length) && i != 1) {
  //           second += ":"
  //         }
  //         second += a[i]
  //       }
  //       newHeaders[first] = second
  //     })
  //     console.log("newHeaders " , newHeaders)
  //     console.log("Content-Length", Number(newHeaders["Content-Length"]))
  //     const reqSize = Number(newHeaders["Content-Length"])
  //     if (reqSize > 1024 * 1024 *10) {
  //       console.log("request too large !")
  //     }
  //     }
    
  //   console.log("oo")
  //   // console.log("chunk", JSON.parse(chunk.toString()))
  //   // console.log("result", data.search("Content-Length"))
  //   // console.log("result2", data.indexOf("Content-Length"))
  //   // console.log("result3", data.slice(data.indexOf("Content-Length")+String("Content-Length").length, data.indexOf("Content-Length")+String("Content-Length").length+10))
    
  // })



// import express from "express";
// import fileUpload from "express-fileupload";
// import path from "path";

// const __dirname = path.resolve(path.dirname(''));

// const app = express();


// app.use(
//   fileUpload({
//     createParentPath: true,

//     limits: {
//       fileSize: 1024 * 1024 * 10 // 10 MB
//   },
//   abortOnLimit: true

//   })
// );



// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });


// app.post("/upload", (req, res) => {
//   if (!req.files) {
//     return res.status(400).send("No files were uploaded.");
//   }
//   const file = req.files.myFile;
//   const path = "files/" + file.name;

//   file.mv(path, (err) => {
//     if (err) {
//       console.log("error", err)
//       return res.status(500).send(err);
//     }
//     return res.send({ status: "success", path: path });
//   })
// });


// app.listen(3000, () => {
//   console.log(`Example app listening on port ${3000}`)
// }) 


// // import multer from "multer"
// // import  express from "express"
// // const storage = multer.diskStorage({
// //     destination: (req, file, callBack) => {
// //         callBack(null, 'uploads')
// //     },
// //     filename: (req, file, callBack) => {
// //         callBack(null, `${file.originalname}`)
// //     }
// //   })
// // let upload = multer({ dest: 'uploads/' })
// // const server = express();
// // const port = 3000
// // server.post('/uploadFileAPI', upload.single('file'), (req, res, next) => {
// //     const file = req.file;
// //     console.log(file.filename);
// //     if (!file) {
// //       const error = new Error('No File')
// //       error.httpStatusCode = 400
// //       return next(error)
// //     }
// //       res.send(file);
// //   })

// // server.listen(port, () => {
// //   console.log(`Example app listening on port ${port}`)
// // }) 