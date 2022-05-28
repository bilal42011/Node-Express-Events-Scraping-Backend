let puppeteer = require("puppeteer");
let dayjs = require("dayjs");
let utc = require("dayjs/plugin/utc");
let timezone = require("dayjs/plugin/timezone");
let updatelocale = require("dayjs/plugin/updateLocale");

dayjs.extend(updatelocale);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.updateLocale("en", {
  weekStart: "1",
});

(async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  await page.goto("https://www.distillery.de/ex/dates");
  let currentdate = dayjs.tz(dayjs(), "Europe/Berlin");
  console.log(currentdate.format());
  let year = currentdate.year();
  let month = (currentdate.month() + 1).toString().padStart(2, "0");

  let monthlyeventlist = await page.evaluate(
    ({ year, month }) => {
      let monthlyevents = [];
      let events = document.querySelectorAll(
        `h1.big a[href*="/ex/dates/${year}/${month}"]`
      );

      for (let event of events) {
        let heading = event.parentElement;
        let headingsibling = heading.nextSibling;
        let artists = headingsibling.querySelectorAll("font.act_title");

        let eventobj = {};
        let text = event.querySelector(".events_link").innerText;
        let textarray = text.split(" ");
        let date = textarray[1].split(".")[0];
        eventobj.date = `${year}-${month}-${date}`;
        textarray.splice(0, 2);
        eventobj.title = textarray.join(" ");
        eventobj.link = event.href;
        eventobj.artists = [];
        for (artist of artists) {
          eventobj.artists.push(artist.innerText);
        }
        monthlyevents.push(eventobj);
        console.log(eventobj.date);
        console.log(eventobj.title);
      }
      console.log(events);
      console.log(year, month);
      return monthlyevents;
    },
    { year, month }
  );

  console.log(monthlyeventlist);

  async function getWeekendEventList(monthlyeventlist, date) {
    let clonemonthlylist = [...monthlyeventlist];
    let weekendeventlist = clonemonthlylist.filter((event) => {
      let eventdate = dayjs.tz(event.date, "Europe/Berlin");

      if (date.isSame(eventdate, "week")) {
        let eventweekday = eventdate.get("day");
        if (eventweekday == 0 || eventweekday == 6 || eventweekday == 5) {
          event.weekday = eventdate.format("ddd");
          event.date = eventdate.format("DD.MM.YY");
          return true;
        }
      }
    });
    console.log(weekendeventlist);

    for (let event of weekendeventlist) {
      await page.goto(event.link);
      let eventinfo = await page.evaluate(() => {
        let eventinfo = {};
        let eventtime = document.querySelector("h1.big");
        eventtime = eventtime.nextSibling.nextSibling.nextSibling.textContent;
        eventinfo.time = eventtime.split(" ")[1];
        console.log(eventinfo.time);

        console.log(eventinfo);
        return eventinfo;
      });
      console.log(eventinfo);
      event.time = eventinfo.time;
    }

    // console.log(weekendeventlist);
    return weekendeventlist;
  }
  let weekendeventlist = await getWeekendEventList(
    monthlyeventlist,
    currentdate
  );
  console.log(weekendeventlist);
})();
