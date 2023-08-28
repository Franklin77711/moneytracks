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
  const [maxLoad, setMaxLoad] = useState<number>(10);
  

  const transHistory = async () => {
    if (uid) {
      const docRef = collection(db, 'users', uid, "transactions");
      const docSnapAll = await getDocs(docRef);
    
      const docArrays:any = [];

      docSnapAll.forEach((doc)=>{
        docArrays.unshift(doc.data())
      })
      setMaxLoad(10)
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
        setMaxLoad(10)
        setDocSpanRender(incomeArr);
      }
      const showOnlyExpense = () =>{
        const expenseArr: any = [];
        docSnap.map((doc:any)=>{
          if(doc.remove > 0){
            expenseArr.push(doc)
          }
        })
        setMaxLoad(10)
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
        setMaxLoad(10)
        setDocSpanRender(expenseArr);
      }
      const showMore =(e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        setMaxLoad(maxLoad + 10)
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
               (<>
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
                    {docSpanRender.slice(0, maxLoad).map((doc: any, index: number) => {
                      if (!doc.timeStamp || doc.category == "") {
                        return null;
                      }
                      return(
                      <tr key={index}>
                        <td>{doc.timeStamp.slice(0, 10) || '-'}</td>
                        {doc.add ? <td className="addHistory">{doc.add.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}</td>:<td className="addHistory">-</td>}
                        {doc.remove ? <td className="removeHistory">{doc.remove.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}</td>:<td className="removeHistory">-</td>}
                        <td>{doc.category || '-'}</td>
                        <td>{doc.categorySub || '-'}</td>
                      </tr>
                    );})}
                  </tbody>
                </table>
                <button className="button" onClick={showMore}>Load more...</button>
              </>
              ):""}
        </div>
    )
}

export default History