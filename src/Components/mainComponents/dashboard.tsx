import { useEffect, useContext, useState } from "react";
import { db } from "../../firebaseConf"
import { getDocs, collection, query, doc, addDoc, setDoc, getDoc } from "firebase/firestore";
import { UserContext } from "../../Context/loggedinUser";


function Dashboard (){
  const { uid, displayname } = useContext(UserContext);
  const [currMoney, setCurrMoney]=useState<number>();
  const [docWriteCompleted, setDocWriteCompleted] = useState(false);

  useEffect(() => {
    const createUserDocument = async () => {
      if (uid) {
        const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);
        if(!docSnap.exists()){
          await setDoc(userDocRef, {money: 0, income: 0, expense: 0})
        }
        setDocWriteCompleted(true)
      }
    };
    createUserDocument();
  }, [uid]);

   useEffect(() => {
      const currentMoney = async () => {
        if (uid && docWriteCompleted) {
          const docRef = doc(db, 'users', uid);
          const docSnap = await getDoc(docRef);
        
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrMoney(data.money)
          }
        }
      };
      currentMoney();
    }, [docWriteCompleted]);
      
    return(
      <div id="dashboard">
        {docWriteCompleted ? 
        <>
          <div id="dash-header">
            <div id="dash-welcome">
              <h1>Hi, {displayname}</h1>
              <h2>welcome back to you wallet</h2>
            </div>
            <div id="dash-total">
              Total money: {currMoney} HUF
            </div>
          </div>
          <div id="dash-content">

          </div>
        </>
        :
          <div id="loader"></div>
        } 
      </div>
    )
}

export default Dashboard