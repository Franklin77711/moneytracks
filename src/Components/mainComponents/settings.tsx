import { useState, useEffect } from "react"
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConf";
import { UserContext } from "../../Context/loggedinUser";
import { useContext } from "react";




function Settings (){
    const { uid } = useContext(UserContext);
    const [noRender, setNoRender] = useState<boolean>(false)

    useEffect(()=>{
        if(uid === "jlhhjQ7aznPLfxE914ydHutePfV2"){
            setNoRender(true)
        }
    })

    return(
        <div id="settings">
            {noRender? 
            <div id="no-access">
                <h1>Demo user can't access this page!</h1>
            </div>:
            <h1>Settings</h1>
            }
        </div>
    )
}

export default Settings