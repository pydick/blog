// const fissionProcess = (num, survivalRate) => {
//     let probability = 0;

//     function fissionProcessInside() {
//         const surlRate = survivalRate;
//         for (let i = 1; i <= num; i++) {
//             let randomNumber = Math.random();
//             if (randomNumber < surlRate) {
//                 probability = probability + surlRate * i;
//             } else {
//                 probability = probability;
//                 break;
//             }
//         }
//         return probability;
//     }
//     return fissionProcessInside();
// }

// const res = fissionProcess(5000, 0.8);
// // console.log(res);

// const survivalNum = 0;
// const deathNum = 0;
// const cellNum = 1;
// const fissionProcess = () => {
//     let random = Math.random();
//     if (random <= 0.8) {
//         return 2;
//     } else {
//         return 0;
//     }
// }
// const fn = (num) {
//     for (let i = 1; i <= num; i++) {

//     }
// }

const probiltyfn = (p) => {
    let alivepro;
    if (p < 0.5) {
        alivepro = 0;
    } else {
        alivepro = (2 * p - 1) / p;
    }
    return alivepro;
}
console.log(probiltyfn(0.8));