import { Unsubscribe, doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import db from "../firebase";
import { redirect, useNavigate } from "react-router-dom";
export type availableTimeType = {
	time: string,
	users: string[]
}
export type OrgContextType = {
  scheduleData: availableTimeType[];
  updateScheduleData: React.Dispatch<React.SetStateAction<availableTimeType[]>>;
  LogIn: (token: string) => any;
  LogOut: () => any;
  error: string | null;
  pending: boolean;
}

export const OrgContext = createContext<OrgContextType>({
  scheduleData: [],
  updateScheduleData: () => {},
  LogIn: (token: string) => {},
  LogOut: () => {},
  pending: false,
  error: null
});




function OrgContextProvider({children}: {children: any}) {
    const [scheduleData, updateScheduleData] = useState<availableTimeType[]>([]);
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [unsub, setUnsub] = useState<null | Unsubscribe>(null);
    let navigate = useNavigate();
    
    
    useEffect(() => {
      const token = localStorage.getItem("__t__")
      if (token !== null) {
        // token exists
        // verify and log in
        startAccountListener(token)
      }
    }, [])

    async function LogIn(token: string) {
      // if there's an current account, unsubscribe
      if (unsub) {
        unsub()
        setUnsub(null)
      }
      // try to login, and listen to updates
      startAccountListener(token)
    } 


    function startAccountListener(token: string) {
      localStorage.removeItem("__t__")
      setPending(true)
      setError(null)
      if (token == null || token == undefined || token.length < 2) {
        setError("invalid token, please retry")
        setPending(false)
        return
      }
      let loged = false


      const unsubL = onSnapshot(
        doc(db, "organisations", token),
        response => {
          console.log("data")
          // check if document exists
          if (!response.exists()) {
            if (!loged) {
              setError("invalid token, please retry")
              setPending(false)
              loged = true
            }
            LogOut()
          }
           // @ts-ignore
          const data: availableTimeType[] = response.data()
          // set data in contexxt, also provide refetch for refreshes
          updateScheduleData(data)


          // for login (first data response)
          if (!loged) {
            // login successfull 
            // set token in localstorage if there is a refresh
            localStorage.setItem("__t__", token)
            loged = true
            // redirect to dashboard
            navigate("/dashboard")
            setPending(false)
          }
        },
        error => {
          console.log("error")
          // for login (first data response)
          if (!loged) {
            setError("invalid token, please retry")
            setPending(false)
            loged = true
            LogOut()
          }
        }
      )
      // @ts-ignore
      setUnsub({unsub: unsubL})



      // setUnsub(unsub)
      // YOU CANNOT DO THIS !!!!!!
      // If you pass a function to useState then it is invoked and the result is used as the default value, so in your code your initial state is “undefined”. 
      // read: https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
    }
    function LogOut() {
      console.log(unsub)
      if (unsub) {
        console.log(unsub)
        // @ts-ignore
        unsub.unsub()
        setUnsub(() => () => "  ")
        setTimeout(() => {
          
        console.log(unsub)
        }, 5000)
      }
      updateScheduleData([])
      navigate("/")
    }
    console.log(unsub)

    return (
      <OrgContext.Provider value={{scheduleData, updateScheduleData, LogIn, LogOut, error, pending}}>
        {children}
      </OrgContext.Provider>
    );
  }





  export default OrgContextProvider