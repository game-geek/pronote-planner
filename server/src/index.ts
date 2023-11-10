import express from "express";
import cors from "cors";
import { calculate } from "./logic"
import { auth, db } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import compression from "compression";
import helmet from "helmet";
import RateLimit from "express-rate-limit";
import fs from "fs"
require('dotenv').config()

const UPLOAD_DIR = __dirname + "/../uploads" 
if (!fs.existsSync(UPLOAD_DIR)){
  fs.mkdirSync(UPLOAD_DIR);
}


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


app.use(express.json());  


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


  
  const form = formidable({ maxFileSize: MAX_BYTES, keepExtensions: true, maxFiles: 1, uploadDir: UPLOAD_DIR, filter: function ({name, originalFilename, mimetype}) {
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




//Start the server in port 8081
const server = app.listen(process.env.PORT || 8080, function () {
  // @ts-ignore
  const port = server.address().port;

  console.log("App started at http://localhost:%s", port);
});

