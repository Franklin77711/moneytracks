import { useState, useEffect } from "react"
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConf";
import { UserContext } from "../../Context/loggedinUser";
import { useContext } from "react";


function History (){

  const { uid } = useContext(UserContext);

  const [docSnap, setDocSnap] = useState<any>(null);
  const [renderStart, setRenderStart] = useState<boolean>(false);
  const [docSpanRender, setDocSpanRender] = useState<any>(null);

  const transHistory = async () => {
    if (uid) {
      const docRef = collection(db, 'users', uid, "transactions");
      const docSnapAll = await getDocs(docRef);
    
      const docArrays:any = [];

      docSnapAll.forEach((doc)=>{
        docArrays.push(doc.data())
      })

      setDocSnap(docArrays);
      setDocSpanRender(docArrays);
      setRenderStart(true)
    }
  };

    useEffect(() => {
        transHistory(); 
      }, []);

      const showOnlyIncome = () =>{
        const incomeArr: any = [];
        docSnap.map((doc:any)=>{
          if(doc.add > 0){
            incomeArr.push(doc)
          }
        })
        setDocSpanRender(incomeArr);
      }
      const showOnlyExpense = () =>{
        const expenseArr: any = [];
        docSnap.map((doc:any)=>{
          if(doc.remove > 0){
            expenseArr.push(doc)
          }
        })
        setDocSpanRender(expenseArr);
      }
      const showOnlyThisMonth = () =>{
        const currentTime =  new Date().toISOString().substring(0, 19)
        const expenseArr: any = [];
        docSnap.map((doc:any)=>{
          if(doc.timeStamp){
            if(doc.timeStamp.slice(0, 10) == currentTime.slice(0, 10)){
              expenseArr.push(doc)
            }
          }
        })
        setDocSpanRender(expenseArr);
      }

    return(
        <div id="history">
            <h1>Transaction History</h1>
            <div id="history-buttons">
            <button onClick={transHistory}>All transaction</button>
              <button onClick={showOnlyThisMonth}>This Month</button>
              <button onClick={showOnlyIncome}>Only Income</button>
              <button onClick={showOnlyExpense}>Only Expense</button>
          </div>
            {renderStart ? 
               (
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Income</th>
                      <th>Expense</th>
                      <th>Category</th>
                      <th>Subcategory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docSpanRender.map((doc: any, index: number) => {
                      if (!doc.timeStamp || doc.category == "") {
                        return null;
                      }
                      return(
                      <tr key={doc.id}>
                        <td>{doc.timeStamp.slice(0, 10) || '-'}</td>
                        <td className="addHistory">{doc.add || '-'}</td>
                        <td className="removeHistory">{doc.remove || '-'}</td>
                        <td>{doc.category || '-'}</td>
                        <td>{doc.categorySub || '-'}</td>
                      </tr>
                    );})}
                  </tbody>
                </table>
              ):""}
        </div>
    )
}

export default History