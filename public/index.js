async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');


    // Fetch Request to Twelvedata's Documentation
    let stockRequest = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1min&apikey=1min&apikey=744d2b30edca4d9e968e9705b7bb626d')
    let stockText = await stockRequest.json() 

    console.log(stockText) 

// using the Mocdata to define stock array
const { GME, MSFT, DIS, BNTX } = mockData;

const stocks = [GME, MSFT, DIS, BNTX];

//function to convert stock symbols into color
function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}
//Time Chart(line0)
stocks.forEach( stock => stock.values.reverse())

new Chart(timeChartCanvas.getContext('2d'), {
    type: 'line',
    data: {
        labels: stocks[0].values.map(value => value.datetime),
        datasets: stocks.map( stock => ({
            label: stock.meta.symbol,
            data: stock.values.map(value => parseFloat(value.high)),
            backgroundColor:  getColor(stock.meta.symbol),
            borderColor: getColor(stock.meta.symbol),
        }))
    }
});


//Highest Price Bar Chart
const highestPrices = stocks.map(stock => Math.max(...stock.values.map(value => parseFloat(value.high))));

new Chart(highestPriceChartCanvas.getContext('2d'), {
    type: 'bar',
    data: {
        labels: stocks.map(stock => stock.meta.symbol),
        datasets: [{
            label: 'Highest Price',
            data: highestPrices,
            backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
            borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
            borderWidth: 1
        }]
    }
})

//Average Price Pie Chart
const averagePrices = stocks.map(stock => {
    const sum = stock.values.reduce((total, value) => total + parseFloat(value.high), 0);
    return sum / stock.values.length;
});

new Chart(averagePriceChartCanvas.getContext('2d'), {
    type: 'pie',
    data: {
        labels: stocks.map(stock => stock.meta.symbol),
        datasets: [{
            label: 'Average Price',
            data: averagePrices,
            backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
            borderColor: 'white',
            borderWidth: 1
        }]
    },

    })

}


main()