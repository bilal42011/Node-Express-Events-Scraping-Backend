let puppeteer = require("puppeteer");
let dayjs = require("dayjs");
let utc = require("dayjs/plugin/utc");
let timezone = require("dayjs/plugin/timezone");
let updatelocale = require("dayjs/plugin/updateLocale");
let customformatparser = require("dayjs/plugin/customParseFormat");

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
let newdate = "12-05-22";
let date = dayjs(newdate, "DD-MM-YY");
console.log(date.format("YYYY-MM-DD"));
console.log(date.get("month"));
console.log(date.get("day"));
console.log(date.get("year"));
console.log(date.format("DD.MM.YY"));
