import {useEffect, useState, useContext} from "react"
import { TransactionContext } from "../../Context/docSnaps";
import DrawChart from "../chartComponents/mainPieChart";
import earnCategoryOptions from "../../data/earnCategory";
import expenseCategoryOptions from "../../data/expenseCategory";

function Statistics (){
    const {userDoc, transactionDoc, userDocRef, transactionDocRef} = useContext(TransactionContext);
    const [subCategorySelect,setSubCategorySelect] = useState<string>("Housing");

    const [addArr, setAddArr] = useState<Array<number>>([])
    const [addSum, setAddSum] = useState<number>()
    const [removeSum, setRemoveSum] = useState<number>()
    const [removeArr, setRemoveArr] = useState<Array<number>>([])
    const [categoryAddAmounts, setCategoryAddAmounts] = useState<{ [category: string]: number }>({});
    const [categoryRemoveAmounts, setCategoryRemoveAmounts] = useState<{ [category: string]: number }>({});
    const [subCategoryAmounts, setSubCategoryAmounts] = useState<{ [category: string]: number }>({});

    useEffect (()=>{
        const collectedAddArr: Array<number> = []
        const collectedRemoveArr: Array<number> = []
        let allAdd: number = 0
        let allRemove: number = 0
        const collectedAddAmounts: { [category: string]: any } = {
            "Category": "Amount"
        };
        const collectedRemoveAmounts: { [category: string]: any } = {
            "Category": "Amount"
        };

    transactionDoc.forEach((doc:any)=>{
        const data = doc.data();
        const {add, remove, category} = data;
        if(add && category){
            collectedAddAmounts[category] = (collectedAddAmounts[category] || 0) + add;
           collectedAddArr.push(add)
           
           allAdd = allAdd+add
        }else if(remove && category){
            collectedRemoveAmounts[category] = (collectedRemoveAmounts[category] || 0) + remove;
            collectedRemoveArr.push(remove)
            allRemove = allRemove + remove
        }
        });
        setCategoryAddAmounts(collectedAddAmounts)
        setCategoryRemoveAmounts(collectedRemoveAmounts)

        setRemoveArr(collectedRemoveArr)
        setAddArr(collectedAddArr)

        setAddSum(allAdd)
        setRemoveSum(allRemove)
    }, [])

    useEffect(()=>{
        if(expenseCategoryOptions.map(e => e.label).includes(subCategorySelect)){
            const collectedRemoveAmountsSub: { [category: string]: any } = {
                "Category": "Amount"
            };
            transactionDoc.forEach((doc:any)=>{
                const data = doc.data();
                const {remove, category, categorySub} = data;
                if (remove && category == subCategorySelect){
                    collectedRemoveAmountsSub[categorySub] = (collectedRemoveAmountsSub[categorySub] || 0) + remove;
                }
            }) 
            setSubCategoryAmounts(collectedRemoveAmountsSub)
        }else{
            const categoryAddAmountsSub: { [category: string]: any } = {
                "Category": "Amount"
            };
            transactionDoc.forEach((doc:any)=>{
                const data = doc.data();
                const {add, category, categorySub} = data;
                if (add && category == subCategorySelect){
                    categoryAddAmountsSub[categorySub] = (categoryAddAmountsSub[categorySub] || 0) + add;
                }
            }) 
            setSubCategoryAmounts(categoryAddAmountsSub)
        }
    }, [subCategorySelect])

    useEffect(()=>{
    })

    return(
        <div id="statistics">
            <div id="main-category-charts">
                <div className="addMainChart chart">
                    <h1 className="mainChartTitle">Total Income Statistic</h1>
                    <DrawChart chartData={Object.entries(categoryAddAmounts)}/>
                </div>
                <div className="removeMainChart chart">
                <h1 className="mainChartTitle">Total Expense Statistic</h1>
                <DrawChart chartData={Object.entries(categoryRemoveAmounts)}/>
                </div>
            </div>
            <div id="subcategory-charts">
                      <div id="subcategory-selection">
                            <label htmlFor="subcategorty">Select sub-category</label>
                            <select id="subcategorty" className="change-option" onChange={(e) => setSubCategorySelect(e.target.value)}>
                                <optgroup label="Expenses">
                                    {expenseCategoryOptions.map((category)=>(
                                        <option key={category.value} value={category.value}>{category.label}</option>
                                    ))}
                                </optgroup>
                                <optgroup label="Earnings">
                                    {earnCategoryOptions.map((category)=>(
                                        <option key={category.value} value={category.value}>{category.label}</option>
                                    ))}
                                </optgroup>
                            </select>
                      </div>
                <div id="subChartDiv">
                {JSON.stringify(subCategoryAmounts) !== JSON.stringify({Category: 'Amount'}) ? <DrawChart chartData={Object.entries(subCategoryAmounts)}/> : <div id="nodata">No data in the selected category!</div>}
                </div>
            </div>
        </div>
    )
}

export default Statistics