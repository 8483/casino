let Hand = require('pokersolver').Hand;

function generateDeck() {
    return [
        'As', 'Ac', 'Ah', 'Ad',
        'Ks', 'Kc', 'Kh', 'Kd',
        'Qs', 'Qc', 'Qh', 'Qd',
        'Js', 'Jc', 'Jh', 'Jd',
        'Ts', 'Tc', 'Th', 'Td',
        '9s', '9c', '9h', '9d',
        '8s', '8c', '8h', '8d',
        '7s', '7c', '7h', '7d',
        '6s', '6c', '6h', '6d',
        '5s', '5c', '5h', '5d',
        '4s', '4c', '4h', '4d',
        '3s', '3c', '3h', '3d',
        '2s', '2c', '2h', '2d',
    ]
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * deck.length)
    let card = deck[randomIndex]; // Last card is number 52, but index 51, because of 0 start.
    // console.log("index", randomIndex, "deck", deck.length, "card", card)
    // if (randomIndex == deck.length) console.log("-----------------------------------------------------------------------------------")
    // console.log(deck)
    deck.splice(randomIndex, 1); // remove card form deck
    return card;
}

function dealHand() {
    let hand = [
        randomCard(),
        randomCard()
    ]
    return hand;
}

function dealFlop() {
    let flop = [
        randomCard(),
        randomCard(),
        randomCard(),
        randomCard(),
        randomCard(),
    ]
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
    let dealtHand = dealHand();
    // dealToExtraPlayers(8);
    let dealtFlop = dealFlop();
    let showdown = dealtFlop.concat(dealtHand)
    let result = Hand.solve(showdown);
    // console.log(showdown, result.name, dealtHand)
    // console.log(deck.length);
    deck = generateDeck(); // Reset the deck for next deal
    return result.name; // ex. Pair, Full House
}

let tripsHands = [
    "Straight Flush",
    "Four of a Kind",
    "Full House",
    "Flush",
    "Straight",
    "Three of a Kind",
    // "Two Pair",
    // "One Pair",
    // "High Card"
]

let tripsHandNumber = 1;
let trips = [];

let countThreeOfAKind = 0;
let countStraight = 0;
let countFlush = 0;
let countFullHouse = 0;
let countQuads = 0;
let countStraightFlush = 0;

let rounds = 1000;

for (let i = 0; i < rounds; i++) {
    let currentDeal = deal();
    if (tripsHands.includes(currentDeal)) {
        // console.log(tripsHandNumber)
        // console.log("\n")
        trips.push(tripsHandNumber);

        if (currentDeal == "Three of a Kind") countThreeOfAKind++;
        if (currentDeal == "Straight") countStraight++;
        if (currentDeal == "Flush") countFlush++;
        if (currentDeal == "Full House") countFullHouse++;
        if (currentDeal == "Four of a Kind") countQuads++;
        if (currentDeal == "Straight Flush") countStraightFlush++;
        tripsHandNumber = 1;
    } else {
        tripsHandNumber++;
    }
}

function averageTripsHand() {
    let sum = trips.reduce((a, b) => a + b)
    return sum / trips.length;
}

// console.log(trips)
console.log("Hands played: ", rounds);
console.log("Average trips hit hand: ", averageTripsHand());
console.log("Max no trips streak: ", Math.max(...trips))
console.log("\n")
console.log("Streaks under 10: ", trips.filter(item => item < 10).length);
console.log("Streaks over 20: ", trips.filter(item => item >= 20).length);
console.log("Streaks over 20: ", trips.filter(item => item >= 20).length);
console.log("Streaks over 30: ", trips.filter(item => item >= 30).length);
// console.log(trips)
console.log("\n")
console.log("Three of a Kind", countThreeOfAKind);
console.log("Straight", countStraight);
console.log("Flush", countFlush);
console.log("Full House", countFullHouse);
console.log("Four of a Kind", countQuads);
console.log("Straight Flush", countStraightFlush);
