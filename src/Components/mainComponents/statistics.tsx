import {useEffect, useState, useContext} from "react"
import { Chart } from "react-google-charts";
import { TransactionContext } from "../../Context/docSnaps";
import { click } from "@testing-library/user-event/dist/click";


function Statistics (){
    const {userDoc, transactionDoc, userDocRef, transactionDocRef} = useContext(TransactionContext);
    
    const obj: object={
        transaction:{
            money:'',
            category:''
        }
    }
    const [addArr, setAddArr] = useState<Array<number>>([])
    const [addSum, setAddSum] = useState<number>()
    const [removeSum, setRemoveSum] = useState<number>()
    const [removeArr, setRemoveArr] = useState<Array<number>>([])
    const [categoryAddAmounts, setCategoryAddAmounts] = useState<{ [category: string]: number }>({});
    const [categoryRemoveAmounts, setCategoryRemoveAmounts] = useState<{ [category: string]: number }>({});

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

    return(
        <div id="statistics">
            <div id="main-category-charts">
                <div className="addMainChart chart">
                    <h1 className="mainChartTitle">Total Income Statistic</h1>
                    <Chart
                     width={"100%"}
                     height={"300px"}
                        chartType="PieChart"
                        legendToggle
                        data={Object.entries(categoryAddAmounts)}
                        options={
                          {
                            legend: 'none',
                            format: 'decimal',
                            colors: ['#6f34ff'],
                            lineWidth: 4,
                            backgroundColor: 'transparent',
                            pieHole: 0.45,
                            is3D: false,
                          }
                        }
                    />
                </div>
                <div className="removeMainChart chart">
                <h1 className="mainChartTitle">Total Expense Statistic</h1>
                    <Chart
                      chartType="PieChart"
                      legendToggle
                      width={"100%"}
                      height={"300px"}
                      data={Object.entries(categoryRemoveAmounts)}

                      options={
                        {
                          legend: 'none',
                          format: 'decimal',
                          colors: ['#6f34ff'],
                          lineWidth: 4,
                          backgroundColor: 'transparent',
                          pieHole: 0.45,
                          is3D: false,
                        }
                      }
                    />
                </div>
            </div>
            <div id="subcategory-charts">
                      <div id="subcategory-selection">
                            <label htmlFor="subcategorty">Select category for in depth</label>
                            <></>
                      </div>
            </div>
        </div>
    )
}

export default Statistics