seriesCount = 10;

function getPieData() {
    var votes = [];

    if (seriesCount == 0) {
        seriesCount = dataset.length;
    }

    for (let i = 0; i < seriesCount; i++) {
        votes.push(dataset[i]['Units Sold'])
    }

    return votes;
}

makeChart.chartjs = () => {    
    const div = document.getElementById('chart');
    const config = {
            type: 'pie',
            data: {
            //labels: [],
            datasets: [
                {
                    data: getPieData(dataset),
                    hoverOffset: 4,
                }
            ],
        },
    };

    timer.start();
    new Chart(div, config); // ASSEMBLING AND RENDERING
    timer.stop();
    timer.print();
}

makeChart.apexCharts = () => {
    const div = document.getElementById('chart');
    const options = {
        chart: {
            type: 'pie'
        },
        //labels: [],
        series: getPieData(dataset),
    }

	timer.start();
    const chart = new ApexCharts(div, options); // ASSEMBLING
    timer.tick();
    chart.render(); // RENDERING
	timer.stop();
	timer.print();
}

makeChart.billboard = () => {
    const data = getPieData(dataset);
    series = [];
    for (let i = 0; i < data.length; i++) {
        serie = [String(i), data[i]];
        series.push(serie);
    }

    const config = {
        data: {
            columns: series,
            type: "pie",
            //colors: {
            //    "1": "rgba(0,143,251)",
            //    "2": "rgba(0,227,150)",
            //},
        },
        bindto: '#chart'
    };

    timer.start();
    bb.generate(config);
    timer.stop();
    timer.print();
}

makeChart.toastUI = () => {
    const div = document.getElementById('chart');
    const data = getPieData(dataset);
    series = [];
    for (let i = 0; i < data.length; i++) {
        serie = { 
            name: String(i),
            data: data[i],
        };
        series.push(serie);
    }
	
    timer.start();
    toastui.Chart.pieChart({
        el: div,
        data: {
            categories: ['Review'],
            series: series,
        },
        options: {
            
        },
    });
    timer.stop();
    timer.print();
}

makeChart.chartist = () => {
    var data = {
        series: getPieData(dataset),
    }

    timer.start();
    new Chartist.Pie('#chart', data);
    timer.stop();
    timer.print();
}
