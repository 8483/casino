let wheel = [1, 2, 1, 20, 1, 2, 5, 1, 2, 1, 10, 1, 5, 1, 2, 1, 2, 40, 1, 2, 1, 2, 5, 1, 2, 10, 1, "x2", 1, 5, 2, 1, 20, 1, 2, 1, 5, 1, 10, 1, 2, 5, 1, 2, 1, 2, 5, 1, 2, 1, 2, 10, 1, "x7"]

let countOne = 23;
let countTwo = 15;
let countFive = 7;
let countTen = 4;
let countTwenty = 2;
let countForty = 1;
let countMultiTwo = 1;
let countMultiSeven = 1;
let countTotal = 54;

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

let one = new Tracker('One')
let two = new Tracker('Two')
let five = new Tracker('Five')
let low = new Tracker('Low - 1, 2, 5')

let ten = new Tracker('Ten')
let twenty = new Tracker('Twenty')
let forty = new Tracker('Forty')

let multiTwo = new Tracker('Multiplier x2')
let multiSeven = new Tracker('Multiplier x7')

let even = new Tracker('Even - 2, 10, 20, 40')
let odd = new Tracker('Odd - 1, 5')

let multi = new Tracker('Multipliers - x2, x7')

let high = new Tracker('High - 10, 20, 40')
let highMulti = new Tracker('High Multi - 10, 20, 40, x2, x7')

let big = new Tracker('Big - 20 40')
let bigMulti = new Tracker('Big Multi - 20, 40, x2, x7')


let spins = 40000000;

for (let i = 0; i < spins; i++) {

    switch (spin()) {
        case 1:
            // console.log("1")
            odd.hit();
            one.hit();
            low.hit();
            break;

        case 2:
            // console.log("2")
            even.hit();
            two.hit();
            low.hit();
            break;

        case 5:
            // console.log("5")
            odd.hit();
            five.hit();
            low.hit();
            break;

        case 10:
            // console.log("10")
            even.hit();
            ten.hit();
            high.hit();
            highMulti.hit();
            break;

        case 20:
            // console.log("Twenty ********************************************************")
            even.hit();
            twenty.hit();
            high.hit();
            highMulti.hit();
            big.hit();
            bigMulti.hit();
            break;

        case 40:
            // console.log("Forty ********************************************************")
            even.hit();
            forty.hit();
            high.hit();
            highMulti.hit();
            big.hit();
            bigMulti.hit();
            break;

        case "x2":
            // console.log("Multi x2 ********************************************************")
            multiTwo.hit();
            multi.hit();
            highMulti.hit();
            bigMulti.hit();
            break;

        case "x7":
            // console.log("Multi x7********************************************************")
            multiSeven.hit();
            multi.hit();
            highMulti.hit();
            bigMulti.hit();
            break;

        default:
            break;
    }

    one.incrementGap();
    two.incrementGap();
    five.incrementGap();
    low.incrementGap();

    ten.incrementGap();
    twenty.incrementGap();
    forty.incrementGap();

    multiTwo.incrementGap();
    multiSeven.incrementGap();

    even.incrementGap();
    odd.incrementGap();

    multi.incrementGap();

    high.incrementGap();
    highMulti.incrementGap();

    big.incrementGap();
    bigMulti.incrementGap();
}

console.log("Spins: ", spins);
console.log("\n");

// one.generateString()
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

one.getProbabilities()
two.getProbabilities();
five.getProbabilities();
ten.getProbabilities()
twenty.getProbabilities()
forty.getProbabilities()
multiTwo.getProbabilities()
multiSeven.getProbabilities()

multi.getProbabilities()
bigMulti.getProbabilities();

even.getProbabilities()
odd.getProbabilities()
high.getProbabilities()
highMulti.getProbabilities()
big.getProbabilities()