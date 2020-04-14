let wheel = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]

function spin() {
    let index = Math.floor(Math.random() * wheel.length);
    let value = wheel[index];
    // console.log(`index: ${index} value: ${value}`)
    return value;
}

function Tracker(name) {
    this.name = name;
    this.count = 0;
    this.gap = 0;
    this.gaps = [];
    this.pay = 0;
    this.delta = 0;

    this.hit = () => {
        this.count++;
        this.gaps.push(this.gap);
        this.gap = 0;
    }

    this.incrementGap = () => {
        this.gap++;
    }

    let averageGap = () => {
        if (this.gaps.length > 0) {
            let sum = this.gaps.reduce((a, b) => a + b);
            return Math.round(sum / this.gaps.length, 2);
        } else {
            return 0;
        }
    }

    let medianGap = () => {
        let sorted = this.gaps.sort((a, b) => a - b)
        return sorted[Math.round(sorted.length / 2)]
    }

    let maxGap = () => {
        if (this.gaps.length > 0) {
            return Math.max(...this.gaps);
        } else {
            return 0;
        }
    }

    this.getDelta = () => {
        return this.gap - this.average;
    }

    this.getBetShare = () => {

        let betShare = this.getDelta() > 0 ? this.getDelta() * this.weight : this.getDelta() * (1 + this.weight);

        return Math.round(betShare * 100) / 100;
    }

    this.getCounts = () => {
        let counts = this.gaps.reduce(function (acc, curr) {
            acc[curr] ? acc[curr]++ : acc[curr] = 1;
            return acc;
        }, {});
        return counts;
    }

    this.getCountsExcel = () => {
        let counts = this.getCounts();
        console.log(`GAPS:`)
        for (const key of Object.keys(counts)) {
            console.log(`${key}`)
        }
        console.log("\n");
        console.log(`COUNTS:`)
        for (const key of Object.keys(counts)) {
            console.log(`${counts[key]}`)
        }
        console.log("\n");
    }

    this.getProbabilities = () => {
        let counts = this.getCounts();

        let totalCount = 0;
        for (const key of Object.keys(counts)) {
            let count = counts[key];
            totalCount += count;
        }

        let stack = 0;
        let probabiities = [];
        for (const key of Object.keys(counts)) {
            let count = counts[key];
            let share = count / totalCount;
            stack += share;

            probabiities.push({
                gap: key,
                share: share,
                shareFloat: Math.round(share * 1000) / 10,
                stack: stack,
                stackFloat: Math.round(stack * 1000) / 10,
            })
        }

        function getGapAtStackFloat(stackFloat) {
            let gap = null;
            probabiities.map(item => {
                if (item.stackFloat <= stackFloat) {
                    gap = item.gap;
                }
            })
            console.log(`${gap} - ${stackFloat}%`)
        }

        // console.log(probabiities)
        console.log(`${this.name}`)
        getGapAtStackFloat(90);
        getGapAtStackFloat(99);
        getGapAtStackFloat(99.9);
        getGapAtStackFloat(100);
        console.log("\n");
    }

    this.generateString = () => {
        // Without max, exceeds call stack?
        // console.log(`${this.name} - Count: ${this.count} ${Math.round(this.count / spins * 100)} % - Average: ${averageGap()} - Median: ${medianGap()} - Max: ${maxGap()}`);
        console.log(`${this.name} - Count: ${this.count} ${Math.round(this.count / spins * 100)} % - Average: ${averageGap()} - Median: ${medianGap()}`);
    }

    this.getChart = () => {

        let counts = this.getCounts();

        let labels = []
        for (const key of Object.keys(counts)) {
            labels.push(key);
        }

        let data = []
        for (const key of Object.keys(counts)) {
            data.push(counts[key]);
        }

        let chartObject = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'spins',
                    data: data
                }]
            },
            options: {
                title: {
                    display: true,
                    text: `${this.name}`
                },
                scales: {
                    xAxes: [
                        {
                            type: "category",
                            labels: labels,
                            // stacked: true,
                            ticks: {
                                fontSize: 6,
                            },
                            gridLines: {
                                color: "rgba(0, 0, 0, 0.1)",
                            }
                        }
                    ],
                }
            }
        }

        const json = JSON.stringify(chartObject);
        const url_escaped_json = encodeURIComponent(json);

        let url = { url: `https://quickchart.io/chart?w=1000&bkg=white&c=${url_escaped_json}` };

        console.log(url);
    }

}

let zero = new Tracker('zero')

let columnFirst = new Tracker('columnFirst')
let columnSecond = new Tracker('columnSecond')
let columnThird = new Tracker('columnThird')

let rowTop = new Tracker('rowTop')
let rowMid = new Tracker('rowMid')
let rowBot = new Tracker('rowBot')

let halfFirst = new Tracker('halfFirst')
let halfSecond = new Tracker('halfSecond')


let spins = 1000000000;

for (let i = 0; i < spins; i++) {

    switch (spin()) {
        case 0:
            zero.hit();
            break;

        default:
            break;
    }

    zero.incrementGap();
}

console.log("Spins: ", spins);
console.log("\n");

zero.generateString()
// two.generateString();
// five.generateString();
// low.generateString()
// console.log("\n");

// ten.generateString()
// twenty.generateString()
// forty.generateString()
// console.log("\n");

// multiTwo.generateString()
// multiSeven.generateString()
// console.log("\n");

// even.generateString()
// odd.generateString()
// console.log("\n");

// multi.generateString()
// console.log("\n");

// high.generateString()
// highMulti.generateString()
// console.log("\n");

// big.generateString()
// bigMulti.generateString()
// console.log("\n");

// // bigMulti.getCounts()
// bigMulti.getChart();
// console.log("\n");

zero.getProbabilities()