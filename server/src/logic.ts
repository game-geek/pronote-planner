import { onSnapshot, collection, addDoc, updateDoc , doc, setDoc, getDocs} from "firebase/firestore";
import {db} from "./firebase"
import fs from "fs";
//@ts-ignore
import pdf from "pdf-parse-fork";
var pdf2img = require('pdf-img-convert');
import { createCanvas, Image, loadImage } from "canvas";


// Types

type ResultType = {
	raw: {column: {rgb: [number, number, number]}}[],
	free: string[]
}
type Person = {
	username: string
	timetable: ResultType
}
type availableTimeType = {
	time: string,
	users: string[],
	starred: boolean
}

// Helper functions

function FormatTimeTable (data: availableTimeType[]): availableTimeType[] {
	  const formatedData: availableTimeType[] = data.map((d, index: number) => {
		  const times = d.time.split(":")
		  let hour = Number(times[1])+8// CHANGE FOR IT TO SHOW Q1 ANDDD Q 2SEPERATEVELY
		  const c = ["lundi Q1", "lundi Q2", "mardi Q1", "mardi Q2", "mercredi Q1", "mercredi Q2", "jeudi Q1", "jeudi Q2", "vendredi Q1", "vendredi Q2"]
		  let day = c[Number(times[0])]
		  console.log(day  + " à " + String(hour) + "h", times)
		  const time = day  + " à " + String(hour) + "h"
		  return {...d, time, users: d.users}
		})
	  return formatedData
  }

  function snapshotError(error: any) {
	console.log("ERROR IN LISTENER", error)
  }

  async function calculate_free_times(response: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>, orgToken: string) {
	try {
		// @ts-ignore
		const persons: Person[] = response.docs.map(doc => doc.data());
		// key is the available time, the value is the users available for that time
		let availableTimetable: any = {}
		// algo !!!
		console.log("starting")
		persons.forEach((person, index) => {
			console.log(index)
			for (let i=0; i < person.timetable.free.length; i++) {
				if (person.timetable.free[i] in availableTimetable) {
					continue
				} else {
					availableTimetable[person.timetable.free[i] as keyof typeof availableTimetable] = []
				}
				for (let x=0; x < persons.length; x++) {
					if (persons[x].timetable.free.includes(person.timetable.free[i])) {
						availableTimetable[person.timetable.free[i] as keyof typeof availableTimetable].push(persons[x].username)
					}
				}
			}
		})
		const documentRef = db.doc("organisations/"+orgToken)
		const res = await documentRef.get()
		// @ts-ignore
		const availableTimesPrev: availableTimeType[] = res.data().free
		let availableTimes: availableTimeType[] = []
		if (availableTimesPrev) {
			// make it a more structered type and sorted
			availableTimes = Object.keys(availableTimetable).map(key => {return {time: key, starred: false, users: availableTimetable[key]}}).sort((a, b) => {
				if (a.starred && b.starred) {
					return 0
				} else if (a.starred) {
					return 1
				} else if (b.starred) {
					return -1
				} else {
					return a.users.length > b.users.length ? -1 : 1
				}
				
			})
		} else {
			// make it a more structered type and sorted
		const availableTimes = Object.keys(availableTimetable).map(key => {return {time: key, starred: false, users: availableTimetable[key]}}).sort((a, b) => a.users.length > b.users.length ? -1 : 1)
		}
		
		
		await documentRef.update({
			free: FormatTimeTable(availableTimes)
		})

		console.log(availableTimes)
		console.log("Current data: ", persons)
	} catch (err: any) {
		// eror while updating docs
		// catch error, notabily the one no document to update -> delete listener
		if (err.code === 5) {
			// org is deleted
			// delete listener
			for (let i=0; i < ORGANAISATIONS_LISTENER.length; i++) {
				if (ORGANAISATIONS_LISTENER[i].orgToken == orgToken) {
					ORGANAISATIONS_LISTENER[i].unsubscribe()
					ORGANAISATIONS_LISTENER.splice(i, 1)
					ORGANAISATIONS.splice(i, 1)
					break
				}
			}
		}
		else {
			console.log("ERROR WHILE UPDATING FREE TIMETABLE", err)
		}
	}
};
  

async function init() {
	ORGANAISATIONS = await db
        .collection('organisations')
        .listDocuments()

	ORGANAISATIONS_LISTENER = ORGANAISATIONS.map(org => {
		let unsubscribe = db.collection("organisations/" + org.id + "/persons").onSnapshot(snapshot => calculate_free_times(snapshot, org.id), snapshotError)
		return {orgToken: org.id, unsubscribe}
	})
}


// Realtime Listeners for existing docs

let ORGANAISATIONS: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[]  = []
let ORGANAISATIONS_LISTENER: {orgToken: string, unsubscribe: () => void}[] = []




// init real time listening
init()


// function called from endpoint

export const calculate = async (path: string, username: string, orgToken: string): Promise<boolean | string> => {
	try  {
		const documentRef = db.doc("organisations/"+orgToken)
		const doc = await documentRef.get()
		if (!doc.exists) {
			// problem
			return "this schedule does not exist"
		}
		// Program to parse pdf

		// read pdf file from location 
		let dataBuffer = fs.readFileSync(path);
		// get metadata and check if pronote pdf
		const pdfInfo = await pdf(dataBuffer)
		if (pdfInfo.info.Author != "Index-Education"){
			console.log(pdfInfo.info.Author)
			return "invalid pronote timetable"
		}

		// convert pdf to image

		const pdfArray = await pdf2img.convert(path, {
			//width: 100, //Number in px
			//height: 100, // Number in px
			page_numbers: [1], // A list of pages to render instead of all of them
			base64: true,
			scale: 2.0
		});
		
		// create a virtual canvas and load image in it

		const img = await loadImage("data:image/png;base64," + String(pdfArray[0]));
		// Initialiaze a new Canvas with the same dimensions
		// as the image, and get a 2D drawing context for it.
		var canvas = createCanvas(img.width, img.height);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);


		// calcualte free spots with fixed targets

		//   position management (setting targets)
		const x_spaces: number = 13
		const y_spaces: number = 12
		const targets: [number, number][][] = []
		for ( let y=2; y < x_spaces-1; y++) {
			let temp: [number, number][] = []
			for (let x=2; x < y_spaces-1; x++) {
				temp.push([((img.width/x_spaces)-10)*y, (img.height/y_spaces)*x])
			}
			targets.push(JSON.parse(JSON.stringify(temp)))
			temp = []
		}
		
		//   getting pixel info based on targets

		let results:ResultType  = {raw: [], free: []}
		for (let y=0; y < targets.length; y++) {
			let temp: {r: number, "g": number, "b": number}[] = []
			for (let x =0; x < targets[y].length; x++) {
				var data = ctx.getImageData(targets[y][x][0],targets[y][x][1], 1, 1).data;
				// temp.push([ data[0], data[1], data[2] ])			
				temp.push({"r": data[0], "g":  data[1], "b": data[2] })

				if (data[0] == 255 && data[1] == 255 && data[2] == 255) {
					// free time
					results.free.push(`${y}:${x}`)
				}
			}
			results.raw.push({column: JSON.parse(JSON.stringify(temp))})
			temp = []
		}

		// write data (free spots) to collection with username
		const userOrgDocRef = db.doc("organisations/"+orgToken+"/persons/" + username)
		await userOrgDocRef.set({
			timetable: results,
			username: username
		})
		// add to listener
		let unsubscribe = db.collection("organisations/" + orgToken + "/persons").onSnapshot((snapshot => calculate_free_times(snapshot, orgToken)), snapshotError)
		ORGANAISATIONS_LISTENER.push( {orgToken, unsubscribe} )
		
		// demo to save canvas (image not needed, for errors in case)
		// Write the image to file
		const buffer = canvas.toBuffer("image/png");
		fs.writeFileSync("./image.png", buffer);
		return true
	} catch (error) {
		// error while parsing and saving data
		console.log("ERROR PARSING PDF, SAVING DATA", error)
		return false
	}

    
}

// TypeScript: Reload Project