import { useContext, useEffect, useRef, useState } from "react"
import { OrgContext } from "./context/orgContext"
import Modal from 'react-modal';
import styles from "./Dashboard.module.css"
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {auth, db} from "./firebase";

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
    const {LogOut, scheduleData} = useContext(OrgContext)
    const [canUpdate, setCanUpdate] = useState<boolean>(false)
    const ref = useRef(null)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState("")

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

    return (
        <>
            <button onClick={LogOut}>Logout</button>
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
        </>
    )
}

export default Dashboard