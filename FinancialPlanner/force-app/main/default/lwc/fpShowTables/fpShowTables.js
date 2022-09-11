import { LightningElement } from "lwc";
//import getContentInString from '@salesforce/apex/FP_FinancialPlannerController.getContentInString';
import ChartJS from "@salesforce/resourceUrl/ChartJS";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class FpShowTables extends LightningElement {
  // Chart Variables
  chart;
  chartJsInitialized = false;
  chartData = [1, 2, 3, 4];
  chartBackgroundColors = ["red", "blue", "green", "yellow"];
  chartType = "doughnut";
  chartConfig = {
    type: this.chartType,
    data: {
      datasets: [
        {
          data: [1, 2, 3, 4], //this.chartData,
          backgroundColor: ["red", "blue", "green", "yellow"], //this.chartBackgroundColors,
          label: "Dataset 1"
        }
      ],
      labels: []
    },
    options: {
      responsive: false,
      legend: {
        position: "right"
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  };

  // Duration Variables
  durationValue;
  durationOptions = [
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" }
  ];
  handleDurationChange(e) {
    this.durationValue = e.detail.value;
    console.log(this.durationValue);
    //this.modifyData(this.durationValue, this.chartData);
  }

  modifyData() {
    // switch (this.durationValue) {
    //   case "Weekly":
    //     this.chartData = this.chartData.forEach((e) => e + 1);
    //     break;
    //   case "Monthly":
    //     this.chartData = this.chartData.reverse();
    //     break;
    //   default:
    //     this.chartData = [];
    //     break;
    // }
  }

  // renderedCallback
  renderedCallback() {
    //If chart is initialized, do nothing
    if (this.chartJsInitialized) return;

    Promise.all([loadScript(this, ChartJS)])
      .then(() => {
        const ctx = this.template
          .querySelector("canvas.chart")
          .getContext("2d");
        this.chart = new window.Chart(ctx, this.config);
        this.isChartJsInitialized = true;
        console.dir(this.chart);
        console.log("loaded");
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading Chart",
            message: error.message,
            variant: "error"
          })
        );
      });
  }
}
