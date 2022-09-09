import { LightningElement, api } from 'lwc';
//import getContentInString from '@salesforce/apex/FP_FinancialPlannerController.getContentInString';
import ChartJS from '@salesforce/resourceUrl/ChartJS';
import { loadScript } from 'lightning/platformResourceLoader';


export default class FpShowTables extends LightningElement {
    chartJsInitialized = false; 
    chart;
    config={
        type : 'doughnut',
        data :{
            datasets :[
                {
                    data: [],
                    backgroundColor :[
                        'rgb(255,99,132)',
                        'rgb(255,159,64)',
                        'rgb(255,205,86)',
                        'rgb(75,192,192)',
                    ],
                    label:'Dataset 1'
                }
            ],
            labels:[]
        },
        options: {
            responsive : true,
            legend : {
                position :'right'
            },
            animation:{
                animateScale: true,
                animateRotate : true
            }
        }
    };

    durationValue;
    durationOptions = [{label: 'Weekly', value:'Weekly'}, {label: 'Monthly', value: 'Monthly'}];
    handleDurationChange(e){
        console.log(this.durationValue);
        
    }
    

    renderedCallback(){
        if(this.chartJsInitialized) return;
        Promise.all([
            loadScript(this, ChartJS)
        ])
        .then(() => {
            const ctx = this.template.querySelector('canvas.donut').getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
            this.isChartJsInitialized = true;
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading Chart',
                    message: error.message,
                    variant: 'error',
                })
            );
        });
    }
}