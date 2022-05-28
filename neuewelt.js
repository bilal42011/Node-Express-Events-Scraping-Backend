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
  await page.goto("https://neuewelt.club/wp/#dates");
  let currentdate = dayjs.tz(dayjs(), "Europe/Berlin");
  console.log(currentdate.format());
  let year = currentdate.year();

  let alleventlist = await page.evaluate((year) => {
    let eventlist = [];
    let events = document.querySelectorAll(
      ".brz-column__items > .brz-wrapper:nth-child(2) .brz-posts .brz-posts__item .brz-row__container > .brz-row:first-child"
    );

    for (let event of events) {
      let currentyear = year;
      let eventobj = {};
      let date = event.querySelector(".brz-columns #post_date p").innerText;
      let datearray = date.split("—");
      datearray.splice(0, 1);
      date = datearray[0];
      datearray = date.split(".");
      if (datearray[2] !== " ") {
        currentyear = datearray[2];
      }
      eventobj.date = `${currentyear}-${datearray[1]}-${datearray[0]}`;
      console.log(eventobj.date);
      eventobj.title = event.querySelector("#wrap_1 #post_title p").innerText;
      console.log(eventobj.title);
      eventobj.link = event.querySelector(
        "#wrap_1 > .brz-column__items .brz-wrapper-clone .brz-wrapper-clone__item a"
      ).href;
      console.log(eventobj.link);
      let artists = event.querySelectorAll(
        "#wrap_1 > .brz-column__items > .brz-wrapper:not(:first-child)"
      );
      let artistlist = [];
      for (let artist of artists) {
        let artistname = artist.querySelector(
          ".brz-accordion__item .brz-accordion__content .brz-rich-text p "
        ).innerText;
        artistlist.push(artistname.trim());
      }
      eventobj.artists = artistlist.filter((artistname) => {
        if (!artistname.length == 0) {
          return true;
        }
      });
      console.log(eventobj.artists);
      eventlist.push(eventobj);
    }
    return eventlist;
  }, year);

  console.log(alleventlist);

  async function getWeekendEventList(alleventlist, date) {
    let clonemonthlylist = [...alleventlist];
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
        let timeinfo = document.querySelector(
          "#postpost_frame .brz-rich-text p"
        ).innerText;
        let timearray = timeinfo.split("\n");
        timeinfo = timearray[0];
        timearray = timinfo.split(":");
        eventinfo.time = timearray[1].trim();
        return eventinfo;
      });
      console.log(eventinfo);
      event.time = eventinfo.time;
    }

    // console.log(weekendeventlist);
    return weekendeventlist;
  }

  let weekendeventlist = await getWeekendEventList(alleventlist, currentdate);
  console.log(weekendeventlist);
})();
