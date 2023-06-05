import { useEffect, useContext, useState, useRef, useLayoutEffect, HtmlHTMLAttributes } from "react";
import { db } from "../../firebaseConf"
import { getDocs, collection, query, doc, addDoc, setDoc, getDoc, updateDoc, where, orderBy} from "firebase/firestore";
import { UserContext } from "../../Context/loggedinUser";
import upArrow from "../../media/uparrow.svg";
import downArrow from "../../media/downarrow.svg";
import expenseCategoryOptions from "../../data/expenseCategory";
import earnCategoryOptions from "../../data/earnCategory";
import { Chart, LineController, TimeScale, LinearScale, PointElement, LineElement, Filler} from "chart.js";
import 'chartjs-adapter-moment';

Chart.register(LineController, TimeScale, LinearScale, PointElement, LineElement);


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

  const [formSourceValueMain,setFormSourceValueMain] = useState<string>("");
  const [formSourceValueSub,setFormSourceValueSub] = useState<string>("");

  const [formReasonValueMain,setFormReasonValueMain] = useState<string>("");
  const [formReasonValueSub,setFormReasonValueSub] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [chartInstance,setChartInstance] = useState<any>();

 
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
    renderCanvas();
    setFormAddValue(null)
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
    renderCanvas();
    setFormRemoveValue(null)
    setFormReasonValueMain("")
    setFormReasonValueSub("")
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
        const transactionsCollectionRef:any = doc(userDocRef, "transactions", currentTime);
        const transactionDocRef = await getDoc(transactionsCollectionRef);
        if(!transactionDocRef.exists()){
          await setDoc(transactionsCollectionRef, { add: formAddValue, category: formSourceValueMain, categorySub:formSourceValueSub,  moneyTotal: currMoney});
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
          await setDoc(transactionsCollectionRef, { remove: formRemoveValue, category: formReasonValueMain, categorySub:formReasonValueSub,  moneyTotal: currMoney});
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
            await setDoc(transactionsCollectionRef, { add: 0, remove: 0, forwhat: "", moneyTotal: 0});
          }
        }

        setDocWriteCompleted(true)
        renderCanvas()
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

  
  const drawLineChart = (timestamps:any, totalMoneyValues:any) => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if(canvas){
      const context:any = canvas.getContext("2d");

    const chart = new Chart(context, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [
          {
            label: 'Money',
            data: totalMoneyValues,
            borderColor: "#6f34ff",
            fill: true,
          },
        ],
      },
      options: {
        animation: false,
        maintainAspectRatio: true,
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
        },
      },
    });
    setChartInstance(chart)
  }
    
  };

  const fetchTransactions = async () => {
    if(uid){
    const userDocRef = doc(db, "users", uid);
    const transactionsRef = collection(userDocRef, "transactions");
    const transactionsSnapshot = await getDocs(transactionsRef);

  
    const timestamps:any = [];
    const totalMoneyValues:any = [];
      if(transactionsSnapshot){
    transactionsSnapshot.forEach((doc) => {
      const {moneyTotal } = doc.data();
      totalMoneyValues.push(moneyTotal);

      const timestamp = doc.id
      timestamps.push(timestamp)
    });
    drawLineChart(timestamps, totalMoneyValues);
  }

  }
  };

const renderCanvas = ()=>{
  if(uid){
    const canvasElement = document.getElementById("canvasRef") as HTMLCanvasElement;
    canvasRef.current = canvasElement;
    fetchTransactions()
      .catch((error) => {
        console.log(error);
      });
  }
}
  
      
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
                              <label htmlFor="main-category-add">Category:</label>
                              <select onChange={(e) => setFormSourceValueMain(e.target.value)} className="change-option" id="main-category-add">
                                <option value="">Select Main Category</option>
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
                                  <option value="">Select Sub Category</option>
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
                              <label htmlFor="main-category-remove">Category:</label>
                              <select onChange={(e) => setFormReasonValueMain(e.target.value)} className="change-option" id="main-category-remove">
                                  <option value="" >Select Main Category</option>
                                  {expenseCategoryOptions.map((category) => (
                                    <option key={category.value} value={category.value}>
                                      {category.label}
                                    </option>
                                  ))}
                              </select>
                              </div>
                              <div className="form-container">
                                <label htmlFor="sub-category-remove"> Sub-Category:</label>
                                <select onChange={(e) => setFormReasonValueSub(e.target.value)} disabled={formReasonValueMain == ""} className="change-option" id="sub-category-remove" required>
                                    <option value="">Select Sub Category</option>
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
            <canvas id="canvasRef" ref={canvasRef}></canvas>
          </div>
          </div>
        </>
        :
          <div id="loader"></div>
        } 
      </div>
    )
}

export default Dashboard