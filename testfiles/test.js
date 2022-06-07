import puppeteer from "puppeteer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import updatelocale from "dayjs/plugin/updateLocale.js";
import customformatparser from "dayjs/plugin/customParseFormat.js";


dayjs.extend(updatelocale);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.updateLocale("en", {
  weekStart: "1",
});
// dayjs.extend(advanceformat);
dayjs.extend(customformatparser);

async () => {
  let browser = await puppeteer.launch({ headless: false, devtools: true });
  let page = await browser.newPage();
  await page.goto("https://ifz.me/");
  let elements = await page.$$('a[href*="2022-05"]');
  for (let event of elements) {
    let date = event.querySelector("event-teaser__date").innerText;
    console.log(date);
  }
};
// let newdate = "12-05-22";
// let date = dayjs(newdate, "DD-MM-YY");
// console.log(date.format("YYYY-MM-DD"));
// console.log(date.get("month"));
// console.log(date.get("day"));
// console.log(date.get("year"));
// console.log(date.format("DD.MM.YY"));

let newdate=dayjs("2022-06-05");
let date=dayjs();
console.log(date.isSame(newdate,"month"));