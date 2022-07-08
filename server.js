const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json());

app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.post("/split-payments/compute" , (req, res) => {
    const payload = req.body
    
    let result = {
        "ID": payload["ID"],
        "Balance": payload['Balance'],
        "SplitBreakdown": []
    }

    let state =  {
        initialBalance:  payload['Amount'],
    }


    /** Compute flat data**/
    const flatData = payload?.SplitInfo.filter(el => el.SplitType  === 'FLAT')
    const getFlatData = flatData.reduce((acc, cur) => {
        result?.SplitBreakdown.push({
            SplitEntityId: cur.SplitEntityId,
            Amount: cur?.SplitValue
        })
        const resp = acc - cur.SplitValue
        result.Balance = resp
        return resp
    }, state.initialBalance)

    

    /** Compute percentage data**/
    const percentData = payload?.SplitInfo.filter(el => el.SplitType  === 'PERCENTAGE')
    const getPercentData = percentData.reduce((acc, cur) => {
        const Amount = (cur.SplitValue / 100) * acc
        result?.SplitBreakdown.push({
            SplitEntityId: cur.SplitEntityId,
            Amount
        })
        result.Balance = acc - Amount
        return acc - Amount
    }, getFlatData)

    /** Compute ratio data**/
    const totalRatio = payload?.SplitInfo.filter(el => el.SplitType  === 'RATIO')
        .reduce((acc, cur) => cur.SplitValue += acc , 0)

    const ratioData = payload?.SplitInfo.filter(el => el.SplitType  === 'RATIO')

    let acc = getPercentData

    ratioData.forEach(el => {
        const Amount = (el.SplitValue / totalRatio) * acc
        result?.SplitBreakdown.push({
            SplitEntityId: el.SplitEntityId,
            Amount
        })
        result.Balance = acc - Amount
        acc = acc - Amount
    })
    
    res.status(200).send(result)
})



 const server = app.listen(process.env.PORT || 8080, function () {
    const port = server.address().port
 })