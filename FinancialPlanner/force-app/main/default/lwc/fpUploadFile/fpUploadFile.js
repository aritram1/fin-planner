import { LightningElement, api } from 'lwc';
import getContentInString from '@salesforce/apex/FP_FinancialPlannerController.getContentInString';
import saveData from '@salesforce/apex/FP_FinancialPlannerController.saveData';

const columns = [
    { label: 'Date (DD/MM)', fieldName: 'transactionDate'},
    { label: 'Narration', fieldName: 'narration'},
    { label: 'Date Realized on', fieldName: 'valueDate'},
    { label: 'Debit Amount', fieldName: 'debitAmount', type: 'currency'},
    { label: 'Credit Amount', fieldName: 'creditAmount' , type: 'currency'},
    { label: 'Chq/Ref Number', fieldName: 'chqRefNumber' },
    { label: 'Closing Balance', fieldName: 'closingBalance' },
];


export default class FpUploadFile extends LightningElement {
    loaded = false;
    showSpinner = false;
    columns = columns;
    columnsFromData; //experimental
    documentId;
    setSpinner(){
        this.showSpinner = true;
    }
    transactions = [];
    handleUploadFinished(e){
        this.loaded = true;
        this.showSpinner = false;
        this.documentId = e.detail.files[0].contentBodyId;
        console.log('--------------');
        console.log(this.documentId);
        console.dir(e.detail.files[0]);
        console.log('--------------');

        getContentInString({ cbId : this.documentId})
        .then(d=>{
            try{
                console.log('--------------');
                console.log('Data received' + JSON.stringify(d));
                console.log('--------------');
                let all = d.split("\r\n");

                this.columnsFromData = all[0].split(',');
                
                let data = [];
                for(let count = 2; count < all.length-1; count++){ //count is 2 to avoid headers, length-1 to avoid last blank row
                    let eachRow = all[count].split(',');
                    console.log('trim=>' + eachRow)
                    let t = {};
                    t.transactionDate = eachRow[0].trim();
                    t.narration = eachRow[1].trim();
                    t.valueDate = eachRow[2].trim();
                    t.debitAmount = eachRow[3].trim();
                    t.creditAmount = eachRow[4].trim();
                    t.chqRefNumber = eachRow[5].trim();
                    t.closingBalance = eachRow[6].trim();
                    data.push(t);
                }
                this.transactions = data;
                console.dir(this.transactions);
            }
            catch(e){
                console.log(e);
            }

        })
        .catch(error=>{
            console.log('Some error happened :' + JSON.stringify(error));
        });
    }

    get emptyTable(){
        return false;//this.transactions.length == 0;
    }

    get acceptedFormats() {
        return ['.pdf', '.txt'];
    }

    handleRowAction(e){
        alert('hey' + e.detail);
    }

    handleSave(e){
        //let s = JSON.stringify(this.transactions);
        saveData({data : this.transactions})
        .then(wrapper=>{
            if(wrapper.result == 'success'){
                alert(`${wrapper.count} records are saved !`);
            }
        })
        .catch(error=>{
            console.log('Some error occurred when Saving!' + error);
        });
        return null;
    }

    result = '';
    handleClick(e){
        
        const url = 'https://finnhub-realtime-stock-price.p.rapidapi.com/quote?symbol=AAPL';

        const options = {
        method: 'GET',
        mode: 'cors',
        crossOriginIsolated: true,
        headers: {
            'Access-Control-Allow-Origin':'*',
            'X-RapidAPI-Key': '67c11d9dabmshd7774ce4012928ep1349f3jsn72bf7db99ebf',
            'X-RapidAPI-Host': 'finnhub-realtime-stock-price.p.rapidapi.com'
        }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(json => {
                this.result = json;
                console.log(json);
            })
            .catch(err => console.error('error:' + err));
        

    }
    
}