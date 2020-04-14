let Hand = require("pokersolver").Hand;

function generateDeck() {
    return [
        "As", "Ac", "Ah", "Ad",
        "Ks", "Kc", "Kh", "Kd",
        "Qs", "Qc", "Qh", "Qd",
        "Js", "Jc", "Jh", "Jd",
        "Ts", "Tc", "Th", "Td",
        "9s", "9c", "9h", "9d",
        "8s", "8c", "8h", "8d",
        "7s", "7c", "7h", "7d",
        "6s", "6c", "6h", "6d",
        "5s", "5c", "5h", "5d",
        "4s", "4c", "4h", "4d",
        "3s", "3c", "3h", "3d",
        "2s", "2c", "2h", "2d"
    ];
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * deck.length);
    let card = deck[randomIndex]; // Last card is number 52, but index 51, because of 0 start.
    // console.log("index", randomIndex, "deck", deck.length, "card", card)
    // if (randomIndex == deck.length) console.log("-----------------------------------------------------------------------------------")
    // console.log(deck)
    deck.splice(randomIndex, 1); // remove card form deck
    return card;
}

function dealHand() {
    let hand = [randomCard(), randomCard()];
    return hand;
}

function dealFlop() {
    let flop = [
        randomCard(),
        randomCard(),
        randomCard(),
        randomCard(),
        randomCard()
    ];
    return flop;
}

let deck = generateDeck();

function dealToExtraPlayers(number) {
    for (let i = 0; i < number; i++) {
        randomCard();
        randomCard();
    }
}

function deal() {
    let dealtHand = dealHand(); // [ '4d', '9s' ]
    // dealToExtraPlayers(8);
    let dealtFlop = dealFlop();
    let showdown = dealtFlop.concat(dealtHand);
    let result = Hand.solve(showdown).name; // Flush
    // console.log(showdown, result.name, dealtHand)
    // console.log(deck.length);
    deck = generateDeck(); // Reset the deck for next deal

    return {
        hand: dealtHand, // [ '4d', '9s' ]
        result: result // ex. Pair, Full House
    }
}

function Tracker(name, average, max, weight) {
    this.name = name;
    this.count = 0;
    this.gap = 0;
    this.gaps = [];
    this.pay = 0;
    this.average = average;
    this.max = max;
    this.weight = weight;
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
        console.log(`${this.name} - Count: ${this.count} ${Math.round(this.count / hands * 100)} % - Average: ${averageGap()} - Median: ${medianGap()}`);
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

let threeOfAKind = new Tracker('Three of a Kind', 17, 180, 0.11)
let straight = new Tracker('Straight', 17, 190, 0.18)
let flush = new Tracker('Flush', 27, 280, 0.31)
let fullHouse = new Tracker('Full House', 32, 310, 0.40)
let quads = new Tracker('Four of a Kind', 503, 4000)
let straightFlush = new Tracker('Straight Flush', 2800, 30000)

let trips = new Tracker('Trips', 7, 82)
let smallTrips = new Tracker('Small Trips')
let bigTrips = new Tracker('Big Trips')
let megaTrips = new Tracker('Mega Trips')

let smallBigTrips = new Tracker('Small Big Trips')
let bigMegaTrips = new Tracker('Big Mega Trips', 14, 200)

let aceFace = new Tracker('AceFace', 14, 200)

// ACES
// AA  30:1
// AFs 20:1
// AF  10:1
// Pair 5:1


let tripsHands = [
    threeOfAKind.name,
    straight.name,
    flush.name,
    fullHouse.name,
    quads.name,
    straightFlush.name,
    // "Two Pair",
    // "One Pair",
    // "High Card"
];

let aceCards = [
    "As", "Ac", "Ah", "Ad",
]

let faceCards = [
    "Ks", "Kc", "Kh", "Kd",
    "Qs", "Qc", "Qh", "Qd",
    "Js", "Jc", "Jh", "Jd",
]

let hands = 1000000;
let roll = 500;
let blind = 1;
let ante = blind;
let tripsBet = 0;
let favorable = false;

for (let i = 0; i < hands; i++) {

    // if (roll < 0) return;

    // let tripsBetTemp = Math.round(threeOfAKind.getBetShare() + straight.getBetShare() + flush.getBetShare() + fullHouse.getBetShare());

    // console.log(`${i}. roll: ${roll} - tripsBetTemp: ${tripsBetTemp} / tripsBet: ${tripsBetTemp > 0 ? tripsBetTemp : 0} - GAPS: three: ${threeOfAKind.getDelta()} (${threeOfAKind.getBetShare()}) - str: ${straight.getDelta()} (${straight.getBetShare()}) - flush: ${flush.getDelta()} (${flush.getBetShare()}) - full: ${fullHouse.getDelta()} (${fullHouse.getBetShare()}) - tripsGap: ${trips.gap} bigMega: ${bigMegaTrips.gap}`)

    // tripsBet = tripsBetTemp > 0 ? tripsBetTemp : 0;

    let currentDeal = deal();
    let hand = currentDeal.hand;
    let result = currentDeal.result;

    if (
        aceCards.includes(hand[0]) && faceCards.includes(hand[1]) // AK
        || aceCards.includes(hand[1]) && faceCards.includes(hand[0]) // KA
        || aceCards.includes(hand[1]) && aceCards.includes(hand[0]) // AA
    ) {
        // console.log(hand)
        aceFace.hit()
    } else {
        aceFace.incrementGap();
    }

    if (tripsHands.includes(result)) {

        trips.hit();

        switch (result) {

            case "Three of a Kind":
                // console.log("Three of a Kind")
                threeOfAKind.hit();
                smallTrips.hit();
                smallBigTrips.hit();
                // roll += tripsBet * 3;
                break;

            case "Straight":
                // console.log("Straight")
                straight.hit();
                smallTrips.hit();
                smallBigTrips.hit();
                // roll += tripsBet * 4;
                break;

            case "Flush":
                // console.log("Flush")
                flush.hit();
                bigTrips.hit();
                smallBigTrips.hit();
                bigMegaTrips.hit();
                // roll += tripsBet * 7;
                break;

            case "Full House":
                // console.log("Full House")
                fullHouse.hit();
                bigTrips.hit();
                smallBigTrips.hit();
                bigMegaTrips.hit();
                // roll += tripsBet * 8;
                break;

            case "Four of a Kind":
                // console.log("\n");
                // console.log("Four of a Kind********************************************************")
                quads.hit();
                megaTrips.hit();
                bigMegaTrips.hit();
                // roll += tripsBet * 30;
                break;

            case "Straight Flush":
                // console.log("\n");
                // console.log("Straight Flush********************************************************")
                straightFlush.hit();
                megaTrips.hit();
                bigMegaTrips.hit();
                // roll += tripsBet * 40;
                break;

            default:
                break;
        }

    } else {

        // roll -= tripsBet;

        trips.incrementGap();

        threeOfAKind.incrementGap();
        straight.incrementGap();
        flush.incrementGap();
        fullHouse.incrementGap();
        quads.incrementGap();
        straightFlush.incrementGap();

        smallTrips.incrementGap();
        bigTrips.incrementGap();
        megaTrips.incrementGap();

        smallBigTrips.incrementGap();
        bigMegaTrips.incrementGap();
    }
}

// console.log(`Roll: ${roll}`)

console.log("Hands: ", hands);
console.log("\n");

aceFace.generateString();

// trips.generateString()
smallBigTrips.generateString();
// bigMegaTrips.generateString();
// console.log("\n");

// smallTrips.generateString()
// bigTrips.generateString()
// megaTrips.generateString()
// console.log("\n");

// threeOfAKind.generateString()
// straight.generateString()
// flush.generateString()
// fullHouse.generateString()
// quads.generateString()
// straightFlush.generateString()
// console.log("\n");

// trips.getCounts()


// trips.getProbabilities()
smallBigTrips.getProbabilities()
aceFace.getProbabilities()