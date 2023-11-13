import { Unsubscribe, addDoc, collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import {db, auth} from "../firebase";
import { redirect, useNavigate } from "react-router-dom";
import { OrgContextType, OrgType } from "../lib/formatTimeTable";
import { signInWithCustomToken } from "firebase/auth";

// CLEAR DB !!! 11/10
export const OrgContext = createContext<OrgContextType>({
  scheduleData: null,
  updateScheduleData: () => {},
  LogIn: (token: string) => {},
  LogOut: () => {},
  SignUp: (username: string) => {},
  pending: false,
  error: null
});


let LISTENER: null | Unsubscribe = null 


function OrgContextProvider({children}: {children: any}) {
    const [scheduleData, updateScheduleData] = useState<OrgType | null>(null);
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    let navigate = useNavigate();
    
    
    useEffect(() => {
      const token = localStorage.getItem("__t__")
      if (token !== null) {
        // token exists
        // verify and log in
        LogIn(token)
      }
    }, [])

    async function LogIn(token: string) {
      localStorage.removeItem("__t__")
      setError(null)
      setPending(true)
      const tokens = token.split(":")
      if (tokens.length !== 2 || tokens[0].length < 3 || tokens[1].length < 3) {
        //error
        setTimeout(() => {
            setError("invalid token, please retry")
            setPending(false)
        }, 0)
        return
      }
      // if there's an current account, unsubscribe
      if (LISTENER) {
        LISTENER()
        LISTENER = null
      }
      updateScheduleData(null)
      // try to login, and listen to updates
      const response = await firebase_login(tokens[1], tokens[0])
      console.log(auth.currentUser)
      // need to add custom auth in firebase dashboard settings
      if (response == true) {
        //succesfull
        startAccountListener(tokens[0])
        localStorage.setItem("__t__", token)
      } 
      setPending(false)
    }

    async function SignUp(username: string) {
      localStorage.removeItem("__t__")
      setError(null)
      setPending(true)
      if (!username|| username.length < 3) {
        //error
        setTimeout(() => {
            setError("invalid username (at least 3 characters), please retry")
            setPending(false)
        }, 0)
        return
      }
      // if there's an current account, unsubscribe
      if (LISTENER) {
        LISTENER()
        LISTENER = null
      }
      updateScheduleData(null)
      // try to login, and listen to updates
      const tokens = await firebase_create_account(username)
      // need to add custom auth in firebase dashboard settings
      if (tokens && tokens.length === 2) {
        //succesfull
        // signin
        console.log("orgToken", tokens[0])
        console.log("authToken", tokens[1])
        const loggued = await firebase_login(tokens[1], tokens[0])
        console.log("user id", auth.currentUser)
        if (loggued) {
          console.log("loggued")
          if (tokens[0]) {
            // succesfull
            startAccountListener(tokens[0])
            localStorage.setItem("__t__", tokens[0] + ':' + tokens[1])
          }
        
        } 
      }
      setPending(false)
    }

    function startAccountListener(token: string) {
      // useState will trigger only one update for this scenario:
      // setPending(true)
      // setPending(true)
      // setPending(true)
      // setPending(false)
      // setPending(true)
      // setError(null)
      // to combat this problem, my homemade shitty solution:
      /*if (token == null || token == undefined || token.length < 2) {
        setTimeout(() => {
          
            setError("invalid token, please retry")
        }, 0)
        return
      }*/
      let loged = false


      const unsubL = onSnapshot(
        doc(db, "organisations", token),
        response => {
          // check if document exists
          if (!response.exists()) {
            if (!loged) {
              setError("invalid token, please retry")
              loged = true
            }
            LogOut()
          }
           // @ts-ignore
          const data: OrgType = response.data()
          // set data in contexxt, also provide refetch for refreshes
          updateScheduleData(data)


          // for login (first data response)
          if (!loged) {
            // login successfull 
            // set token in localstorage if there is a refresh
            loged = true
            // redirect to dashboard
            navigate("/dashboard")
          }
        },
        error => {
          // for login (first data response)
          if (!loged) {
            setError("invalid token, please retry")
            setPending(false)
            loged = true
            LogOut()
          }
        }
      )
      LISTENER = unsubL



      // setUnsub(unsub)
      // YOU CANNOT DO THIS !!!!!!
      // If you pass a function to useState then it is invoked and the result is used as the default value, so in your code your initial state is “undefined”. 
      // read: https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
    
      // tryed using unsub in state, but its a nightmare, when you actually call the func it doenst unusbscribes, i have to override the func for it to actually unsub !!  plus the new func has the properties of the parent scope, weird 
        // see orgcontextsanpshot, maybe debug in the future
        // using global variables are much much easier and cleaner
    }

    // async function create_org(username: string) {
    //   try {
    //      // create org doc
    //      const response = await addDoc(collection(db, "organisations"), {
    //       username
    //     })
    //     if (response.id) {
    //       return response.id
    //     }
    //   } catch(err) {
    //     // @ts-ignore
    //     setError(err.code)
    // }
    // }

    function LogOut() {
      localStorage.removeItem("__t__")
      if (LISTENER) {
        LISTENER()
        LISTENER = null
      }
      updateScheduleData(null)
      navigate("/")
    }

    async function firebase_create_account(username: string) {
      const response = await fetch("https://pronote.adaptable.app" + "/create_user", {method: 'post', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify({username})})
      if (response.ok) {
        const data = await response.json()
        console.log("token creation", data)
        return [data.orgToken, data.authToken]
      } else {
        const data = await response.json()
        console.log("error token creation", data)
        setError(data.code)
        return false
      }
    }

    async function firebase_login (token: string, userID: string) {
      if (auth.currentUser && userID == auth.currentUser.uid) {
        // alwready logged in
        console.log("alwready loggued in")
        return true
      }
      try {
        const userCredential = await signInWithCustomToken(auth, token)
        // Signed in
        const user = userCredential.user;
        return true
      } catch (error) {
        //  @ts-ignore
        setError(error.code)
        return false
      }
    }

    return (
      <OrgContext.Provider value={{scheduleData, updateScheduleData, SignUp, LogIn, LogOut, error, pending}}>
        {children}
      </OrgContext.Provider>
    );
  }





  export default OrgContextProvider