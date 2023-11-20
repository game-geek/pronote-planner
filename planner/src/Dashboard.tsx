import { useContext, useEffect, useRef, useState } from "react"
import { OrgContext } from "./context/orgContext"
import Modal from 'react-modal';
import styles from "./Dashboard.module.css"
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {auth, db} from "./firebase";
import { useNavigate } from "react-router-dom";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "black",
      textAlign: "center",
      color: "white"
    }
  };
const Dashboard = () => {
    const {LogOut, scheduleData, userTokens, authIsReady} = useContext(OrgContext)
    const [canUpdate, setCanUpdate] = useState<boolean>(false)
    const ref = useRef(null)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState("")
    const navigate = useNavigate();

    const [credentialModalOpen, setCredentialModalOpen] = useState<boolean>(false)
    const [logoutWarningModalOpen, setLogoutWarningModalOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!userTokens && authIsReady) {
            // no user
            console.log("redirecting")
            navigate("/")
        }
    }, [userTokens, authIsReady])

    function handleDeleteUser() {
        setIsOpen(false)
        // delete user 
        deleteDoc(doc(db, "organisations/" + localStorage.getItem("__t__") + "/persons/" + user)).catch(err => alert(err.code))
        
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!scheduleData || !scheduleData.free) {
            return
        }
        // update data
        // @ts-ignore
        const formData = new FormData(ref.current);
        // @ts-ignore
        const formObject: {[uid: string]: string} = Object.fromEntries(formData.entries());
        let changed = false
        const simplified = scheduleData.free.map((el, index) => {return {id: index, starred: el.starred}})
        const keys = Object.keys(formObject)
        console.log(keys)
        // modified data
        const newData = {...scheduleData, free: scheduleData.free.map((option, index) => {
            return {
                ...option,
                starred: String(index) in formObject ? formObject[String(index)] == "on" ? true : false : option.starred
            }
        })}
        console.log(newData)
        // updateDoc(doc(db, "organisations/" + auth.currentUser?.uid), scheduleData)
        // setCanUpdate(false)
    }
    function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
        // enable update selected
        console.log(e.target, ref.current)
        // @ts-ignore
        const formData = new FormData(ref.current);
        // @ts-ignore
        const formObject: {[uid]: string} = Object.fromEntries(formData.entries());
        let changed = false
        const simplified = scheduleData?.free.map((el, index) => {return {id: index, starred: el.starred}})
        const keys = Object.keys(formObject)
        console.log( formObject)
        for (let i=0; i < keys.length; i++) {
            // @ts-ignore
            if (simplified.includes({id: keys[i], starred: formObject[keys[i]] == "on" ? true : false})) {
                // is equal
            } else {
                // is not 
                changed = true
                break
            }
        }
        if (changed) {
            setCanUpdate(true)
        } else {
            setCanUpdate(false)
        }
    }
    function closeModal() {
        setIsOpen(false);
      }
      function copyToClipBoard (text: string) {
        navigator.clipboard.writeText(text);
      }

    return (
        <>
            <div style={{display: "flex", alignItems: "space-between", justifyContent: "space-between", marginLeft: 20 , marginRight: 20}}>
                <p>Your add timetable url to share: {userTokens ? "https://pronote-planner.web.app/org/" + userTokens[0] : "error, please sign in"}</p>
                <button onClick={() => copyToClipBoard(userTokens ? "https://pronote-planner.web.app/org/" + userTokens[0] : "error, please signin")}>Copy Share Url</button>
            </div>
            <button onClick={() => setLogoutWarningModalOpen(true)}>Logout</button>
            <button onClick={() => setCredentialModalOpen(true)}>show account credentials</button>
            {(scheduleData && scheduleData.free) && <form ref={ref} onChange={handleChange} onSubmit={handleSubmit}>
                {canUpdate && <button type="submit">show selected times to everybody</button>}
                <table>
                    <tbody>
                        <tr key={0}>
                            <th>Time</th>
                            <th>people available</th>
                        </tr>
                    {scheduleData.free.map((slot, index) => {
                        return (
                            <tr key={index+1}>
                                {/* @ts-ignore */}
                                <th>{slot.time}<input name={String(index)} type="checkbox"  /></th>
                                {/* @ts-ignore */}
                                <th>{slot.users.map(user => (<p className={styles.user} onClick={(e) => {setIsOpen(true);setUser(e.target.textContent);}} key={(index+1)/10}>{user}</p>))}</th>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </form>}
            {(!scheduleData || !scheduleData.free) && <p>No Data at the moment</p>}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={"Example Modal" } 
                // @ts-ignore
                style={customStyles}
            >
                <h1>Are you sure you want to delete this user's timetable ?</h1>
                <button style={{marginRight: 20}} type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                <button style={{backgroundColor: "red"}} type="button" onClick={handleDeleteUser}>Delete</button>
            </Modal>
            {/* credentials modal */}
            <Modal
                isOpen={credentialModalOpen}
                onRequestClose={() => setCredentialModalOpen(false)}
                contentLabel={"Example Modal" } 
                // @ts-ignore
                style={customStyles}
            >
                <h2>Your credentials are not resetable, so please keep them extremely secret</h2>
                
                <p>note that your credentials are stored in localstorage</p>
                <p>please allow clipboard settings</p>
                <button style={{marginRight: 20}} type="button" onClick={() => copyToClipBoard(userTokens ? userTokens[0]+":"+userTokens[1] : "error - please signin")} >Copy to clipboard</button>
                <button type="button"  onClick={() => setCredentialModalOpen(false)}>Close</button>
            </Modal>
            {/* logout warning modal */}
            <Modal
                isOpen={logoutWarningModalOpen}
                onRequestClose={() => setLogoutWarningModalOpen(false)}
                contentLabel={"Example Modal" } 
                // @ts-ignore
                style={customStyles}
            >
                <h1>Logout ?</h1>
                <p>Insure you have your credentials stored safely</p>
                <button style={{marginRight: 20, backgroundColor: "red"}} type="button"  onClick={LogOut} >Logout</button>
                <button type="button"  onClick={() => setLogoutWarningModalOpen(false)}>Cancel</button>
            </Modal>
        </>
    )
}

export default Dashboard