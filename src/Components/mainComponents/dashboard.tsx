import { useEffect, useContext, useState, useRef } from "react";
import { db } from "../../firebaseConf"
import { getDocs, collection, doc, setDoc, getDoc, updateDoc,} from "firebase/firestore";
import { UserContext } from "../../Context/loggedinUser";
import upArrow from "../../media/uparrow.svg";
import downArrow from "../../media/downarrow.svg";
import expenseCategoryOptions from "../../data/expenseCategory";
import earnCategoryOptions from "../../data/earnCategory";
import { Chart } from "react-google-charts";
import { TransactionContext } from "../../Context/docSnaps";


function Dashboard (){
  const { uid, displayname } = useContext(UserContext);
  const {userDoc, transactionDoc, userDocRef, transactionDocRef, setUserDoc, setTransactionDoc, setUserDocRef, setTransactionDocRef} = useContext(TransactionContext)
  const [currMoney, setCurrMoney]=useState<number>();
  const [docWriteCompleted, setDocWriteCompleted] = useState<boolean>(false);
  const [totalIncome, setTotalIncome]=useState<number>(0);
  const [totalExpense, setTotalExpense]=useState<number>(0);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formAddValue, setFormAddValue] = useState<number>(0);
  const [formRemoveValue, setFormRemoveValue] = useState<number>(0);
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false);
  const [chartStartPoint, setChartStartPoint] = useState<number>(0);

  const [formSourceValueMain,setFormSourceValueMain] = useState<string>("");
  const [formSourceValueSub,setFormSourceValueSub] = useState<string>("");

  const [formReasonValueMain,setFormReasonValueMain] = useState<string>("");
  const [formReasonValueSub,setFormReasonValueSub] = useState<string>("");

  const [chartData, setChartData] = useState<Array<[string, number]>>([]);

  const [docRead, setDocRead] = useState<boolean>(false);


 useEffect(()=>{ //get the user documents from Firebase
  if (uid) {
  const createUserDocument = async () => {
      const userDocRefCall = doc(db, "users", uid);
      setUserDocRef(userDocRefCall)
      const docSnapUsers = await getDoc(userDocRefCall);
      setUserDoc(docSnapUsers)

      const docRef = collection(db, 'users', uid, "transactions");
      setTransactionDocRef(docRef)
      const docSnapTransaction = await getDocs(docRef);
      setTransactionDoc(docSnapTransaction)

      setDocRead(true)
    }
    createUserDocument()
 }}, [uid])


  useEffect(()=>{ //update total money
    if (docRead) {
    const clacMoney = totalIncome+totalExpense;
    setCurrMoney(clacMoney)
    }
  }, [totalIncome,totalExpense])

  const handleIncomeAdd = (event:any) =>{
    event.preventDefault();
    setTotalIncome(totalIncome + formAddValue);
    updateDocMoneyAdd();
    updateDocMoney();
    createLogFromAdd();
    setFormAddValue(0)
    setFormSourceValueMain("");
    setFormSourceValueSub("")
    handleCancel();
  }
  const handleExpenseAdd = (event:any)=>{
    event.preventDefault();
    setTotalExpense(totalExpense - formRemoveValue);
    updateDocMoneyRemove();
    updateDocMoneyTotal();
    createLogFromRemove();
    setFormRemoveValue(0)
    setFormReasonValueMain("")
    setFormReasonValueSub("")
    handleCancel();
  }

  const handleCancel = () =>{ //cancel add/expense form
    setShowAddForm(false)
    setShowExpenseForm(false)
  }
  const updateDocMoney = async()=>{ //update total money in Firebase afterAdd
    if (uid) {
    if(userDoc.exists()){
      const currentDocMoney = userDoc.data();

      const updatedMoney = currentDocMoney.money + formAddValue;

      await updateDoc(userDocRef, {money: updatedMoney})
    }
  }
  }
  const updateDocMoneyTotal = async()=>{ //update total money in Firebase after remove
  if (uid) {
  if(userDoc.exists()){
    const currentDocMoney = userDoc.data();

    const updatedMoney = currentDocMoney.money - formRemoveValue;

    await updateDoc(userDocRef, {money: updatedMoney})
  }
}
  } 
  const createLogFromAdd = async()=>{  //log create to firebase from add
    if (uid) {

      if(userDoc.exists()){
        const currentTime =  new Date().toISOString().substring(0, 19)
        const transactionsCollectionRef:any = doc(userDocRef, "transactions", currentTime);
        await setDoc(transactionsCollectionRef, { add: formAddValue, category: formSourceValueMain, categorySub:formSourceValueSub,  moneyTotal: currMoney, timeStamp: currentTime});
      }
    }
  }
  const createLogFromRemove = async()=>{ //log create to firebase from remove
    if (uid) {

      if(userDoc.exists()){
        const currentTime =  new Date().toISOString().substring(0, 19)
        const transactionsCollectionRef = doc(userDocRef, "transactions", currentTime);
        await setDoc(transactionsCollectionRef, { remove: formRemoveValue, category: formReasonValueMain, categorySub:formReasonValueSub,  moneyTotal: currMoney, timeStamp: currentTime});
      }
    }
  }

  const updateDocMoneyAdd = async () => { //update total add in firebase
    if (uid) {
      if(userDoc.exists()){
        const currentIncome = userDoc.data();
        const updatedIncome = currentIncome.income + formAddValue;
        await updateDoc(userDocRef, {income: updatedIncome})
      }
    }
  }
  const updateDocMoneyRemove = async () => { //update total remove from firebase
    if (uid) {
      if(userDoc.exists()){
        const currentIncome = userDoc.data();
        const updatedIncome = currentIncome.expense - formRemoveValue;
        await updateDoc(userDocRef, {expense: updatedIncome})
      }
    }
  }

  useEffect(() => { //create user in firebase for new user
    if (docRead) {
    const createUserDocument = async () => {
        if(!userDoc.exists()){
          await setDoc(userDocRef, {money: 0, income: 0, expense: 0})
          const currentTime =  new Date().toISOString().substring(0, 19)
          const transactionsCollectionRef = doc(userDocRef, "transactions", currentTime);
          await setDoc(transactionsCollectionRef, { add: 0, remove: 0, category: "", cetegorySub: "", moneyTotal: 0,  timeStamp: currentTime});
        }

        setDocWriteCompleted(true)
      }
    createUserDocument();
  };
  }, [docRead]);

  useEffect(() => { //get total money from firebase after inicializaton
    if (uid && docWriteCompleted) {
      const currentMoney = async () => {
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCurrMoney(data.money)
            setTotalIncome(data.income)
            setTotalExpense(data.expense)
          }
        }

      currentMoney();
    };
  }, [docWriteCompleted]);

  useEffect(()=>{ //get the data for Line Chart
    if (docRead) {
    const getData = async () => {
      
        const docArrays:Array<any> = [["Date", "Totalmoney"]];
        
        transactionDoc.forEach((doc:any)=>{
          const data = doc.data();
          const { timeStamp, moneyTotal } = data;
          docArrays.push([ timeStamp.slice(5, 10), moneyTotal ])
        })
        const dataRows = docArrays.slice(1);
        const formattedData = dataRows.reverse().slice(0,10).map((row:[string, number | string]) => [row[0].slice(0,10), Number(row[1])]);
        const formattedDocArrays = [docArrays[0], ...formattedData.reverse()];
        setChartStartPoint(formattedDocArrays[1][1])
        setChartData(formattedDocArrays)
    }
    getData()
  }
    
  }, [docWriteCompleted])

      
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
              Total money: {currMoney?.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })} HUF
            </div>
          </div>
          <div id="dash-content">
          <div className="dash-content-child" id="dash-add-container">
            <div className="total-money-container">
              <p className="total-title">TOTAL INCOME</p>
              <p className="total-money"><span className="income-value">{totalIncome.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })} </span><span className="currency">HUF</span></p>
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
                              <label htmlFor="main-category-add">Category:</label>
                              <select onChange={(e) => setFormSourceValueMain(e.target.value)} className="change-option" id="main-category-add">
                                <option>Select Main Category</option>
                                {earnCategoryOptions.map((category) => (
                                  <option key={category.value} value={category.value}>
                                    {category.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-container">
                              <label htmlFor="sub-category-add">Sub-Category:</label>
                              <select onChange={(e) => setFormSourceValueSub(e.target.value)} disabled={formSourceValueMain == ""} className="change-option" id="sub-category-add">
                                  <option >Select Sub Category</option>
                                  {earnCategoryOptions
                                    .find((category) => category.value === formSourceValueMain)
                                    ?.subcategories.map((subcategory) => (
                                      <option key={subcategory} value={subcategory}>
                                        {subcategory}
                                      </option>
                                    ))}
                              </select>
                            </div>
                            <div className="change-btn-container">
                              <button className="change-btn" type="button" onClick={handleCancel}>Cancel</button>
                              <button className="change-btn" type="submit">Add Income</button>
                            </div>
                        </form>:""}
          <div className="dash-content-child" id="dash-remove-container">
            <div className="total-money-container">
              <p className="total-title">TOTAL EXPENSE</p>
              <p className="total-money"><span className="income-value">{totalExpense.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}</span> <span className="currency">HUF</span></p>
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
                              <label htmlFor="main-category-remove">Category:</label>
                              <select onChange={(e) => setFormReasonValueMain(e.target.value)} value={formReasonValueMain} className="change-option" id="main-category-remove">
                                  <option  >Select Main Category</option>
                                  {expenseCategoryOptions.map((category) => (
                                    <option key={category.value} value={category.value}>
                                      {category.label}
                                    </option>
                                  ))}
                              </select>
                              </div>
                              <div className="form-container">
                                <label htmlFor="sub-category-remove"> Sub-Category:</label>
                                <select onChange={(e) => setFormReasonValueSub(e.target.value)} value={formReasonValueSub} disabled={formReasonValueMain == ""} className="change-option" id="sub-category-remove" required>
                                    <option >Select Sub Category</option>
                                    {expenseCategoryOptions
                                      .find((category) => category.value === formReasonValueMain)
                                      ?.subcategories.map((subcategory) => (
                                        <option key={subcategory} value={subcategory}>
                                          {subcategory}
                                        </option>
                                      ))}
                                </select>
                              </div>
                            <div className="change-btn-container">
                              <button className="change-btn" type="button" onClick={handleCancel}>Cancel</button>
                              <button className="change-btn" type="submit">Add Expense</button>
                            </div>
                        </form>:""}
          <div className="dash-content-child" id="dash-graph-container">
          <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      legendToggle
      data={chartData}
      options={
        {
          legend: 'none',
          format: 'decimal',
          colors: ['#6f34ff'],
          lineWidth: 4,
          backgroundColor: 'transparent',
          hAxis: {
            textStyle: {
              color: 'white'
            },
          },
          vAxis: {
            textStyle: {
              color: 'white'
            },
            viewWindow: {
              min: {chartStartPoint}, //chart starting point
            },
            gridlines: {
              color: 'gray', 
              opacity: 0.1,  
            },
          }
        }
      }
    />
          </div>
          </div>
        </>
        :
          <div className="loader"></div>
        } 
      </div>
    )
}

export default Dashboard