import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import {db} from "./firebase"
import { OrgContext } from "./context/orgContext"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import Loader from "./Loader"

export default  () => {
    const [isOpen, setIsOpen] = useState(false)
        const { LogIn, SignUp, pending, error } = useContext(OrgContext)
    const [start, setStart] = useState(false)


    function handleSignin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // retrieve token from form
        // @ts-ignore
        const formData = new FormData(e.target);
        // @ts-ignore
        const formObject: {token: string} = Object.fromEntries(formData.entries());
        LogIn(formObject.token.trim())
        setStart(true)
        
    }

    useEffect(() => {
        //console.log(error, pending)
        if (start && !pending && error) {
            // alert(error)
            toast("❌ Error: "+error)
            setStart(false)
        }
        // else if (start && !pending && !error) {
        //     toast("✨ Welcome back")
        //     setStart(false)
        // }
    }, [pending])
    console.log(start, pending, error)

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // retrieve token from form
        // @ts-ignore
        const formData = new FormData(e.target);
        // @ts-ignore
        const formObject: {username: string} = Object.fromEntries(formData.entries());
        SignUp(formObject.username.trim())
        setStart(true)
        // try {
        //     const response = await addDoc(collection(db, "organisations"), {
        //         username: formObject.username.trim()
        //     })
        //     LogIn(response.id)
        // }catch(error) {
        //     // @ts-ignore
        //     alert("couldn't create your schedule, " + error.code)
        // }
    }



    return (
        <div>
            <h1>Planner is a free tool to find the best suitable free time in pronote timetables for many people</h1>
            <div>
                <button onClick={() => setIsOpen(prevState => !prevState)}>{isOpen ? "Cancel" : "Create or modify a schedule"}</button>
            </div>
            {isOpen && <div style={{padding: "20px"}}>
                    <p>Modify/Manage schedule:</p>
                    <form onSubmit={handleSignin} style={{display: "flex", alignItems: "center", margin: "0 20px 0 20px", justifyContent: "space-between", flexDirection: "row"}}>
                        <input name="token" style={{minWidth: "20vw", height: 20, fontSize: 14}} type="text" placeholder="your secret schedule token" />
                        {pending && <Loader width="50px" height="50px" />}
                        {!pending && <button>Log in</button>}
                    </form>
                    <p>Create new schedule:</p>
                    <form onSubmit={handleCreate} style={{display: "flex", alignItems: "center", margin: "0 20px 0 20px", justifyContent: "space-between", flexDirection: "row"}}>
                        <input name="username" style={{minWidth: "20vw", height: 20, fontSize: 14}} type="text" placeholder="your name" />
                        {pending && <Loader width="50px" height="50px" />}
                        {!pending && <button>create a schedule</button>}
                    </form>
                </div>}
        </div>
    )
}