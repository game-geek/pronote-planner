import { useContext, useEffect, useRef, useState } from "react"
import { OrgContext } from "./context/orgContext"
import Modal from 'react-modal';
import styles from "./Dashboard.module.css"
import tableStyles from "./tableStyles.module.css"

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {auth, db} from "./firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";
// icons
import { MdEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaRegCopy } from "react-icons/fa";
import Loader from "./Loader";

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
    const ref = useRef<HTMLFormElement>(null) 
    const [modalIsOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState("")
    const navigate = useNavigate();
    const [deletingUser, setDeletingUser] = useState(false)

    const [editing, setEditing] = useState<boolean>(false)

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
        if (!auth.currentUser) return toast("❌ please signin", {
            autoClose: 2000,
            hideProgressBar: true
        })
        // delete user 
        deleteDoc(doc(db, "organisations/" + auth.currentUser.uid + "/persons/" + user))
            .catch(err => toast("❗ couldn't delete user: " + err.code, {
                autoClose: 2000,
                hideProgressBar: true
            }))
            
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!auth.currentUser) return toast("❌ please signin", {
            autoClose: 2000,
            hideProgressBar: true
        })
        if (!scheduleData || !scheduleData.free) {
            return
        }
        // update data
        // @ts-ignore
        const formData = new FormData(ref.current);
        // @ts-ignore
        const formKeys: string[] = Object.keys(Object.fromEntries(formData.entries()));

        // modified data
        const newData = {...scheduleData, free: scheduleData.free.map((option, index) => {
            return {
                ...option,
                // formObject contains only elements checked, and all of them
                starred: formKeys.includes(String(index))
            }
        })}
        updateDoc(doc(db, "organisations/" + auth.currentUser.uid), {free: newData.free}).catch(err => toast("❗ couldn't update listing: " + err.code, {
            autoClose: 2000,
            hideProgressBar: true
        }))
        setCanUpdate(false)
        setEditing(false)
    }
    function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
        // enable update selected
        // @ts-ignore
        const formData = new FormData(ref.current);// Display the values
        // object with all the selected times
        // @ts-ignore
        const formKeys: string[] = Object.keys(Object.fromEntries(formData.entries()));
        console.log(formKeys)
        let changed = false
        //  @ts-ignore
        const simplified: number[] = scheduleData?.free.reduce((total: number[], el, index) => {
            if (el.starred) total.push(index)
            return total
        }, [])

        console.log(simplified)
        for (const key of formKeys) {
            
            if (simplified.includes(Number(key))) {
                // not modified
            } else {
                // is not 
                changed = true
                 break
            }
        }
        if (formKeys.length !== simplified.length) {
            changed = true
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
      function copyToClipBoard (text: string, message="copied !") {
        navigator.clipboard.writeText(text);
        toast(message, {
            autoClose: 2000,
            hideProgressBar: true
        })
      }

      function resetForm (){
        setCanUpdate(false)
        ref.current?.reset()
        setEditing(false)
      }

    return (
        <div className={styles.main}>
            <div className={styles.top}>
                <div style={{display: "flex", alignItems: "space-between", justifyContent: "space-between", marginLeft: 20 , marginRight: 20}}>
                    <p onClick={() => copyToClipBoard(userTokens ? "https://pronote-planner.web.app/org/" + userTokens[0] : "error, please signin", "copied share url !")}>
                        <strong>Your add timetable url to share:</strong> {userTokens ? <a href={"https://pronote-planner.web.app/org/" + userTokens[0]} target="_blank">{"https://pronote-planner.web.app/org/" + userTokens[0]}</a> : "error, please sign in"}
                    </p>
                    <button onClick={() => copyToClipBoard(userTokens ? "https://pronote-planner.web.app/org/" + userTokens[0] : "error, please signin", "copied share url !")}><FaRegCopy /></button>
                </div>
                <button onClick={() => setLogoutWarningModalOpen(true)}>Logout</button>
                <button onClick={() => setCredentialModalOpen(true)}>show account credentials</button>
                {!editing && <button onClick={() => setEditing(true)}><MdEdit /></button>}
            </div>
            {(scheduleData && scheduleData.free) && <form ref={ref} onChange={handleChange} onSubmit={handleSubmit}>
                {editing && <button type="submit"><FaRegSave /></button>}
                {editing && <button onClick={resetForm} type="reset"><IoMdClose/></button>}
                <table className={tableStyles.table}>
                    <tbody>
                        <tr key={0}>
                            <th style={{width: "min-width"}}></th>
                            <th>Time</th>
                            <th>people available</th>
                        </tr>
                    {scheduleData.free.map((slot, index) => {
                        return (
                            <tr  key={index+1}>
                                <th className={slot.starred ? tableStyles.starred : undefined}>{slot.starred ? "starred" : ""}</th>
                                {/* need to be ablse to inially set the satrres -> bug */}
                                {/* @ts-ignore */}
                                <th>{slot.time}{editing && <input name={String(index)} type="checkbox" defaultChecked={slot.starred}  />}</th>
                                {/* @ts-ignore */}
                                <th className={tableStyles.people}>{slot.users.map(user => (<p className={styles.user} onClick={(e) => {setIsOpen(true);setUser(e.target.textContent);}} key={Math.random()}>{user}</p>))}{deletingUser && <Loader />}</th>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {!scheduleData || scheduleData.free.length == 0 && <p style={{textAlign: "center"}}>No data available</p>}
            </form>}
            {(!scheduleData || !scheduleData.free) && <p>No Data at the moment</p>}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={"Delete User: " + user } 
                // @ts-ignore
                style={customStyles}
                ariaHideApp={false}
            >
                <h1>Are you sure you want to delete this user's timetable ?</h1>
                <p>Note that it might take up to a minute</p>
                <button style={{marginRight: 20}} type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                <button style={{backgroundColor: "red", color: "white"}} type="button" onClick={handleDeleteUser}>Delete</button>
            </Modal>
            {/* credentials modal */}
            <Modal
                isOpen={credentialModalOpen}
                onRequestClose={() => setCredentialModalOpen(false)}
                contentLabel={"Your Secret Credentials" } 
                // @ts-ignore
                style={customStyles}
                ariaHideApp={false}
            >
                <h2>Your credentials are not resetable, so please keep them extremely secret</h2>
                
                <p>note that your credentials are stored in localstorage</p>
                <button style={{marginRight: 20}} type="button" onClick={() => copyToClipBoard(userTokens ? userTokens[0]+":"+userTokens[1] : "error - please signin", "copied your secret token !")} >Copy to clipboard</button>
                <button type="button"  onClick={() => setCredentialModalOpen(false)}>Close</button>
            </Modal>
            {/* logout warning modal */}
            <Modal
                isOpen={logoutWarningModalOpen}
                onRequestClose={() => setLogoutWarningModalOpen(false)}
                contentLabel={"Logout ?" } 
                // @ts-ignore
                style={customStyles}
                ariaHideApp={false}
            >
                <h1>Logout ?</h1>
                <p>Insure you have your credentials stored safely</p>
                <button style={{marginRight: 20, backgroundColor: "red", color: "white"}} type="button"  onClick={LogOut} >Logout</button>
                <button type="button"  onClick={() => setLogoutWarningModalOpen(false)}>Cancel</button>
            </Modal>
        </div>
    )
}

export default Dashboard