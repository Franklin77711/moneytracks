import { useEffect, useContext, useState } from "react";
import { db } from "../../firebaseConf"
import { getDocs, collection, query, doc, addDoc, setDoc, getDoc, updateDoc} from "firebase/firestore";
import { UserContext } from "../../Context/loggedinUser";
import upArrow from "../../media/uparrow.svg"
import downArrow from "../../media/downarrow.svg"

function Dashboard (){
  const { uid, displayname } = useContext(UserContext);
  const [currMoney, setCurrMoney]=useState<number>();
  const [docWriteCompleted, setDocWriteCompleted] = useState<boolean>(false);
  const [totalIncome, setTotalIncome]=useState<number>(0);
  const [totalExpense, setTotalExpense]=useState<number>(0);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formAddValue, setFormAddValue] = useState<number|any>(null);
  const [formRemoveValue, setFormRemoveValue] = useState<number|any>(null);
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false);
  const [formSourceValue,setFormSourceValue] = useState<string>("");
  const [formReasonValue,setFormReasonValue] = useState<string>("");

  useEffect(()=>{
    const clacMoney = totalIncome+totalExpense;
    setCurrMoney(clacMoney)
  }, [totalIncome,totalExpense])

  const handleIncomeAdd = (event:any) =>{
    event.preventDefault();
    setTotalIncome(totalIncome + formAddValue);
    updateDocMoneyAdd();
    updateDocMoney();
    createLogFromAdd();
    setFormAddValue(null)
    setFormSourceValue("")
    handleCancel();
  }
  const handleExpenseAdd = (event:any)=>{
    event.preventDefault();
    setTotalExpense(totalExpense - formRemoveValue);
    updateDocMoneyRemove();
    updateDocMoneyTotal();
    createLogFromRemove();
    setFormRemoveValue(null)
    setFormReasonValue("")
    handleCancel();
  }

  const handleCancel = () =>{
    setShowAddForm(false)
    setShowExpenseForm(false)
  }
  const updateDocMoney = async()=>{
    if (uid) {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if(docSnap.exists()){
      const currentDocMoney = docSnap.data();

      const updatedMoney = currentDocMoney.money + formAddValue;

      await updateDoc(userDocRef, {money: updatedMoney})
    }
  }
}
const updateDocMoneyTotal = async()=>{
  if (uid) {
  const userDocRef = doc(db, "users", uid);
  const docSnap = await getDoc(userDocRef);
  if(docSnap.exists()){
    const currentDocMoney = docSnap.data();

    const updatedMoney = currentDocMoney.money - formRemoveValue;

    await updateDoc(userDocRef, {money: updatedMoney})
  }
}
}
  const createLogFromAdd = async()=>{
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);

      if(docSnap.exists()){
        const currentTime =  new Date().toISOString().substring(0, 19)
        const transactionsCollectionRef = doc(userDocRef, "transactions", currentTime);
        const transactionDocRef = await getDoc(transactionsCollectionRef);
        if(!transactionDocRef.exists()){
          await setDoc(transactionsCollectionRef, { add: formAddValue, remove: formRemoveValue, forwhat: formSourceValue});
        }
      }
    }
  }
  const createLogFromRemove = async()=>{
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);

      if(docSnap.exists()){
        const currentTime =  new Date().toISOString().substring(0, 19)
        const transactionsCollectionRef = doc(userDocRef, "transactions", currentTime);
        const transactionDocRef = await getDoc(transactionsCollectionRef);
        if(!transactionDocRef.exists()){
          await setDoc(transactionsCollectionRef, { add: formAddValue, remove: formRemoveValue, forwhat: formReasonValue});
        }
      }
    }
  }

  const updateDocMoneyAdd = async () => {
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);
      if(docSnap.exists()){
        const currentIncome = docSnap.data();

        const updatedIncome = currentIncome.income + formAddValue;

        await updateDoc(userDocRef, {income: updatedIncome})
      }
    }
  }
  const updateDocMoneyRemove = async () => {
    if (uid) {
      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);
      if(docSnap.exists()){
        const currentIncome = docSnap.data();

        const updatedIncome = currentIncome.expense - formRemoveValue;

        await updateDoc(userDocRef, {expense: updatedIncome})
      }
    }
  }

  useEffect(() => {
    const createUserDocument = async () => {
      if (uid) {
        const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);

        if(!docSnap.exists()){
          await setDoc(userDocRef, {money: 0, income: 0, expense: 0})

          const currentTime =  new Date().toISOString().substring(0, 19)
          const transactionsCollectionRef = doc(userDocRef, "transactions", currentTime);
          const transactionDocRef = await getDoc(transactionsCollectionRef);
          if(!transactionDocRef.exists()){
            await setDoc(transactionsCollectionRef, { add: 0, remove: 0, forwhat: ""});
          }
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
            setTotalIncome(data.income)
            setTotalExpense(data.expense)
          }
        }
      };
      currentMoney();
    }, [docWriteCompleted]);
      
    return(
      <div id="dashboard">
        <div className={showAddForm || showExpenseForm ? "overlay":""} onClick={handleCancel}></div>
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
          <div className="dash-content-child" id="dash-add-container">
            <div className="total-money-container">
              <p className="total-title">TOTAL INCOME</p>
              <p className="total-money">{totalIncome} <span className="currency">HUF</span></p>
            </div>
            <div className="total-btn" onClick={()=>{setShowAddForm(true)}}>
              <p>Add Income</p>
              <p>{">>"}</p>
            </div>
            <div className="img-holder"><img src={upArrow} alt="up arrow" className="arrow-img up"/></div>
          </div>
          {showAddForm ? <form className="change-form" onSubmit={handleIncomeAdd}>
                            <div className="form-container">
                              <label htmlFor="addForm">Amount:</label>
                              <input placeholder="HUF" required className="change-input" id="addForm" type="number" onChange={(e)=>{setFormAddValue(e.target.valueAsNumber)}} value={formAddValue} min={1}></input>
                            </div>
                            <div className="form-container">
                              <label htmlFor="addSource">Source:</label>
                              <input placeholder={totalIncome === 0 ? "First upload": "Part-time job"} required className="change-input" id="addSource" type="text" onChange={(e)=>{setFormSourceValue(e.target.value)}} value={formSourceValue}></input>
                            </div>
                            <div className="change-btn-container">
                              <button className="change-btn" type="button" onClick={handleCancel}>Cancel</button>
                              <button className="change-btn" type="submit">Add Income</button>
                            </div>
                        </form>:""}
          <div className="dash-content-child" id="dash-remove-container">
            <div className="total-money-container">
              <p className="total-title">TOTAL EXPENSE</p>
              <p className="total-money">{totalExpense} <span className="currency">HUF</span></p>
            </div>
            <div className="total-btn" onClick={()=>{setShowExpenseForm(true)}}>
              <p>Add Expense</p>
              <p>{">>"}</p>
            </div>
            <div className="img-holder"><img src={downArrow} alt="up arrow" className="arrow-img down"/></div>
          </div>
          {showExpenseForm ? <form className="change-form" onSubmit={handleExpenseAdd}>
                            <div className="form-container">
                              <label htmlFor="addForm">Amount:</label>
                              <input placeholder="HUF" required className="change-input" id="expenseForm" type="number" onChange={(e)=>{setFormRemoveValue(e.target.valueAsNumber)}} value={formRemoveValue} min={1}></input>
                            </div>
                            <div className="form-container">
                              <label htmlFor="expenseReason">Reason:</label>
                              <input placeholder="Party" required className="change-input" id="expenseReason" type="text" onChange={(e)=>{setFormReasonValue(e.target.value)}} value={formReasonValue}></input>
                            </div>
                            <div className="change-btn-container">
                              <button className="change-btn" type="button" onClick={handleCancel}>Cancel</button>
                              <button className="change-btn" type="submit">Add Expense</button>
                            </div>
                        </form>:""}
          <div className="dash-content-child" id="dash-graph-container">3</div>
          </div>
        </>
        :
          <div id="loader"></div>
        } 
      </div>
    )
}

export default Dashboard