// https://www.youtube.com/watch?v=KuGhy_7ZzmI&ab_channel=CEGDealerSchool

function spin() {
    return Math.round(Math.random() * 36);
}

let spins = 100;
let betSize = 2;

let payoutNumber = 35;
let payoutSplit = 17;
let payoutRow = 2;

let bankroll = 1000;

let betSplit = [2, 3, 4, 5, 8, 9, 10, 11, 14, 15, 16, 17, 20, 21, 22, 23, 26, 27, 28, 29, 32, 33, 34, 35];
let betRow = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];

for (let i = 0; i < spins; i++) {
    let number = spin();

    bankroll -= 14;

    if (betSplit.includes(number)) bankroll += betSize * payoutSplit + betSize;
    if (betRow.includes(number)) bankroll += 2 * betSize * payoutRow + 2 * betSize;

    console.log(number, bankroll);
}
