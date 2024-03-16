import { doc, updateDoc } from 'firebase/firestore'
import React, { FC, useState } from 'react'
import { db } from './firebase'



type OrgDetailsProps = {
    orgName: string,
    orgInfo: string,
    org: string
}

const OrgDetails: FC<OrgDetailsProps> = ({ orgName, orgInfo, org }) => {
    const [name, setName] = useState(orgName)
    const [info, setInfo] = useState(orgInfo)


    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (org === "") return
        updateDoc(doc(db, "organisations", org), {
            orgName: name,
            orgInfo: info
        })
    }

  return (
    <div>
        <h3>Organisation details</h3>
        <form onSubmit={handleSubmit}>
            <label>
                <span>Meeting Name (appears first for users) </span>
                <input value={name} onChange={e => setName(e.target.value)} type='text' name='name'></input>
            </label>
            <label style={{marginLeft: 10}}>
                <span>description</span>
                <input value={info} onChange={e => setInfo(e.target.value)}  type='text' name='info'></input>
            </label>
            { (name !== orgName || orgInfo !== info) && <button style={{marginLeft: 10}} type="submit">Modify</button>}
        </form>

    </div>
  )
}

export default OrgDetails