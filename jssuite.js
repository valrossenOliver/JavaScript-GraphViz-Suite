/** BACKGROUND FUNCTIONS */
function setAPI(choice) {
    apiChoice = choice;
    console.log("Api Chosen: " + apiChoice);
}

function setChartType(choice) {
    chartType = choice;
    console.log("Will draw: " + chartType);
}

function onFileLoaded(fileContents) {
    switch (apiChoice) {
        case "chartapi":
            console.log("Making CHART JS...");
            makeChart_ChartJS(document.getElementById('chart'), fileContents);
            break;

        case "apexcharts":
            console.log("Making ApexChart...");
            makeChart_ApexCharts(document.getElementById('chart'), fileContents);
            break;

        case "billboard":
            console.log("Making Billboard...");
            makeChart_Billboard('#chart', fileContents);
            break;

        case "toastui":
            console.error("NOT IMPLEMENTED!");
            console.log("Making ToastUI...");
            makeChart_ToastUI();
            break;

        default:
            console.error("INVALID API CHOICE: " + apiChoice);
            break;
    }
    
}

function onFileSelected()
{
    const files = document.getElementById('fileselector').files; // FileList object
    
    if (files.length === 1) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const data = reader.result;
            onFileLoaded(data);
        });

        const mainFile = files.item(0);
        reader.readAsText(mainFile, 'ISO-8859-1');
    }
}

function parseCSV(data) {
    data = data.replace(/["]/g, "");
    const columns = data.slice(0, data.indexOf('\r\n')).split(',');
    const rows = data.split('\r\n').slice(1, 23);

    const dataset = rows.map(function (row) {
        const values = row.split(',');
        const el = columns.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    return dataset;
}

/** SUITE MAIN FUNCTIONS */
function makeChart_ChartJS(canvas, data) {
    const ctx = canvas.getContext('2d');
    const dataset = parseCSV(data);
    const config = { type: undefined, data: undefined };

    switch (chartType) {
        case "pie":
            config.type = "pie";
            config.data = parsePie_chartjs(dataset);
            new Chart(ctx, config);
            break;

        case "line":
            config.type = "line";
            config.data = parseLine_chartjs(dataset);
            new Chart(ctx, config);
            break;
    
        default:
            console.log("NO CHART TYPE SELECTED!");
            break;
    }
}

function makeChart_ApexCharts(div, data) {
    const dataset = parseCSV(data);
    const options = parsePie_apexCharts(dataset);
    const chart = new ApexCharts(div, options);
    chart.render();
}

function makeChart_Billboard(bindString, data) {
    const dataset = parseCSV(data);
    const config = parsePie_billboard(bindString, dataset);
    bb.generate(config);
}

/** PIE CHART DRAWING FUNCTIONS */
function getTotalGenders (dataset) {
    let numberMen = 0;
    let numberWomen = 0;

    for (let i = 0; i < dataset.length; i++) {
        const spanSexRow = dataset[i];
        let spanSexPopulation = parseInt(spanSexRow.Population_2021);

        if (spanSexRow.sex === "men") {
            numberMen = numberMen + spanSexPopulation;
        } else if (spanSexRow.sex === "women") {
            numberWomen = numberWomen + spanSexPopulation;
        }
    }

    return { numberMen: numberMen, numberWomen: numberWomen };
}

function parsePie_chartjs(dataset) {    
    const totalGenders = getTotalGenders(dataset);

    const data = {
        labels: [
            'Men',
            'Women',
        ],
        datasets: [{
            label: 'Number of registered women & men 2021',
            data: [totalGenders.numberMen, totalGenders.numberWomen],
            backgroundColor: [
            'rgba(0,143,251)',
            'rgba(0,227,150)',
            ],
            hoverOffset: 4
        }]
    };
    return data;
}

function parsePie_apexCharts(dataset) {
    const totalGenders = getTotalGenders(dataset);

    var options = {
        chart: {
            type: 'pie'
        },
        labels: ["Men", "Women"],
        series: [totalGenders.numberMen, totalGenders.numberWomen],
    }

    return options;
}

function parsePie_billboard(bindString, dataset) {
    const totalGenders = getTotalGenders(dataset);

    return {
        data: {
            columns: [
                ["Men", totalGenders.numberMen],
                ["Women", totalGenders.numberWomen]
            ],
            type: "pie",
            colors: {
                Men: "rgba(0,143,251)",
                Women: "rgba(0,227,150)",
            },
        },
        bindto: bindString
    };
}

/** LINE CHART DRAWING FUNCTIONS */
function parseLine_chartjs(dataset) {
    let labels = [];
    for (let year = 1968; year <= 2021; year++)
        labels.push(year);

    let lenght = 2021 - 1968 + 1;
    let menConsensus = Array(lenght).fill(0);
    let womenConsensus = Array(lenght).fill(0);

    let isMen = true;

    // For each age/sex-group
    for (let i = 0; i < dataset.length; i++) {
        const spanSexRow = dataset[i];
        const entries = Object.entries(spanSexRow);
        
        // Add each year of the group 
        let lastEntryIndex = entries.findIndex(entry => entry[0] === 'Population_2021');
        for (let j = 2; j <= lastEntryIndex; j++) { // start at 1968 and goes to 2021
            const entry = entries[j];

            if (isMen) {
                menConsensus[j - 2] += parseInt(entry[1]);
            } else {
                womenConsensus[j - 2] += parseInt(entry[1]);
            }
        }

        isMen = !isMen;
    }

    const data = {
        labels: labels,
        datasets: [{
            label: '# of Men',
            data: menConsensus,
            fill: false,
            borderColor: 'rgb(0, 0, 255)',
            tension: 0.1
        }, {
            label: '# of Women',
            data: womenConsensus,
            fill: false,
            borderColor: 'rgb(255, 0, 0)',
            tension: 0.1
        }]
    };
    return data;
}
