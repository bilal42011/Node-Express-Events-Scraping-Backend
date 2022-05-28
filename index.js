let puppeteer = require("puppeteer");
let math = require("mathjs");
let dayjs = require("dayjs");
let utc = require("dayjs/plugin/utc");
let timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault("Africa/Lagos");

let updatelocale = require("dayjs/plugin/updateLocale");
dayjs.extend(updatelocale);

let weekday = require("dayjs/plugin/weekday");
dayjs.extend(weekday);

let localdata = require("dayjs/plugin/localeData");
require("dayjs/locale/en-gb");
dayjs.extend(localdata);
// console.log(locale);

dayjs.locale("en-gb");
console.log(dayjs.locale());
// dayjs.updateLocale('en', {
//     weekStart:1
//     })
globalLocaleData = dayjs.localeData();
// console.log(globalLocaleData);
let current = new Date();
console.log("Now Date() date is: " + current.toString());
let now = dayjs();
console.log(now);
console.log("Now dayjs date is: " + now.format("ddd, MMM D YYYY,  H:m:s"));

let date = dayjs("2018-07-08");
console.log(date.get("M") + 1);
console.log(date.format("MMM"));
console.log(date.endOf("week").format("D"));
console.log(date.day()); //for normal weekdays
console.log(date.get("date"));
console.log(date.weekday(2).get("date")); //weekday Plugin for locale weekday
console.log("date day is: " + date.format("dddd"));
console.log("date is: " + date.format());
console.log("First day of this local is: " + globalLocaleData.firstDayOfWeek());
// console.log(date.toString());
// console.log(date.toDateString());
// console.log(date.getDate());
// console.log(date.getDay());
// console.log(date.getMonth());

let newdate = dayjs("2018-08-06T16:00:00.000Z");
console.log(newdate.get("month"));
console.log("newdate day is: " + newdate.get("day"));
// console.log(newdate);
console.log("newdate is: " + newdate.toString());
let sameweek = false;
// if(newdate.getMonth()==date.getMonth() && newdate.getFullYear()==date.getFullYear()){
// //    let maxdate;
// //    let mindate;
// //    if(newdate.getDate()>date.getDate()){
// //        maxdate=newdate.getDate();
// //        mindate=date.getDate();
// //    }
// //    else{
// //        maxdate=date.getDate();
// //        mindate=newdate.getDate();
// //    }
// // console.log(maxdate);
// // console.log(mindate);
// if(math.abs(newdate.getDate()-date.getDate())<7){
// sameweek=true;
// if(newdate.getDay()>3){
// console.log("its weekend");
// }
// }
// }
// console.log(sameweek);

// (async ()=>{

//     let browser = await puppeteer.launch({headless:false});
//     let page = await browser.newPage();
//     await page.goto("https://mjut.me/");

//     let columns= await page.evaluate(()=>{
//         let table=document.querySelector("table tbody tr td table");
//         let columns=[];

//         for(let i=0;i<table.rows.length;i++){

//     for(let j=0;j<table.rows[i].cells.length;j++){
//     let celldata=table.rows[i].cells[j].innerText;
//     if(j==0){
//         if(celldata=="fri" || celldata=="sat" || celldata=="sun"){
//             columns.push(celldata);
//             continue;
//         }
//         else{
//             break;
//         }
//     }
//     columns.push(celldata);
// }
// }
//          return columns;
//     })

//     console.log(columns);
//     // await browser.close();

// });

console.log(date.isSame(newdate, "week"));

if (date.isSame(newdate, "week")) {
  console.log("Same Week");
  let day = newdate.get("day");
  if (day == 0 || day == 5 || day == 6) {
    console.log("Its a Weekend");
  } else {
    console.log("Its not a weekend");
  }
}
// else if(newdate.isAfter(date,"day")){
//     console.log("not same week but sunday");
// }
else {
  console.log("not same week");
}
