import puppeteer from "puppeteer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import updatelocale from "dayjs/plugin/updateLocale.js";
import customformatparser from "dayjs/plugin/customParseFormat.js";
import {v4 as uuidv4} from "uuid";

dayjs.extend(updatelocale);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.updateLocale("en", {
  weekStart: "1",
});
dayjs.extend(customformatparser);

let getWeekendEventList = async (req, res) => {
  console.log("inside async function");
  let browser = await puppeteer.launch();
  let page = await browser.newPage(); 
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://ifz.me/");

  let currentdate = dayjs.tz(dayjs(), "Europe/Berlin");
  console.log(currentdate.format());
  let year = currentdate.year();
  let month = (currentdate.month() + 1).toString().padStart(2, "0");

  let monthlyeventlist = await page.evaluate(
    ({ year: currentyear, month: currentmonth }) => {
      let eventlist = [];
      let events = document.querySelectorAll(
        `a[href*="${currentyear}-${currentmonth}"]`
      );

      for (let event of events) {
        let eventobj = {};
        let date = event.querySelector(".event-teaser__date").innerText;
        eventobj.title = event.querySelector(".event-teaser__title").innerText;
        eventobj.date = `${currentyear}-${currentmonth}-${date}`;
        eventobj.link = event.href;
        eventlist.push(eventobj);
      }
      console.log(eventlist);
      return eventlist;
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
          event.location="ifz";
          event.id=uuidv4();
          return true;
        }
      }
    });
    console.log(weekendeventlist);

    for (let event of weekendeventlist) {
      await page.goto(event.link);
      let eventinfo = await page.evaluate(() => {
        let eventinfo = {};
        let event = document.querySelector(
          ".overlay-wrapper .overlay.overlay--active .overlay__content .event"
        );
        eventinfo.time = event.querySelector(
          ".event__doors .event__doors-time"
        ).innerText;
        eventinfo.artists = [];
        let artists = event.querySelectorAll(
          ".event__lineup.event__section.event__lineup--full-width .event__lineup-item.lineup-item"
        );
        for (let artist of artists) {
          let artistname = artist.querySelector(".lineup-item__name").innerText;
          eventinfo.artists.push(artistname);
        }
        console.log(eventinfo);
        return eventinfo;
      });

      event.time = eventinfo.time;
      event.artists = eventinfo.artists;
    }

    // console.log(weekendeventlist);
    return weekendeventlist;
  }

  let weekendeventlist = await getWeekendEventList(
    monthlyeventlist,
    currentdate
  );
  await browser.close();
  console.log(weekendeventlist);
  res.status(200);
  res.json(weekendeventlist);
};

let getAllWeekendEventList = async (req, res) => {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://ifz.me/");
  let eventlinks = await page.$$eval("a.event-teaser", (events) => {
    let eventlinks = [];

    for (let event of events) {
      eventlinks.push(event.href);
    }
    return eventlinks;
  });
  console.log(eventlinks.length);
  let alleventlist = [];
  let currentdate = dayjs.tz(dayjs(), "Europe/Berlin");
  let year = currentdate.format("YY");

  for (let eventlink of eventlinks) {
    await page.goto(eventlink);

    let event = await page.$eval(
      ".event",
      (event, currentyear) => {
        let eventobj = {};
        eventobj.title = event.querySelector(".event__title").innerText;
        let date = event.querySelector(".event__date").innerText;
        let datearray = date.split(".");
        if (datearray[2] !== "") {
          currentyear = datearray[2];
        }
        eventobj.date = `${currentyear}-${datearray[1]}-${datearray[0]}`;
        eventobj.time = event.querySelector(
          ".event__doors .event__doors-time"
        ).innerText;
        eventobj.artists = [];
        let artists = event.querySelectorAll(
          ".event__lineup.event__section .event__lineup-item.lineup-item"
        );
        for (let artist of artists) {
          let artistname = artist.querySelector(".lineup-item__name").innerText;
          eventobj.artists.push(artistname);
        }

        return eventobj;
      },
      year
    );

    alleventlist.push(event);
  }
  await browser.close();
  console.log(alleventlist);

  function getAllWeekendEventList(eventlist, currentdate) {
    let clonemonthlylist = [...eventlist];
    let weekendeventlist = clonemonthlylist.filter((event) => {
      let date = dayjs(event.date, "YY-MM-DD").format("YYYY-MM-DD");
      let eventdate = dayjs.tz(date, "Europe/Berlin");

      let eventweekday = eventdate.get("day");
      if (
        eventdate.isAfter(currentdate, "week") ||
        eventdate.isSame(currentdate, "week")
      ) {
        if (eventweekday == 0 || eventweekday == 6 || eventweekday == 5) {
          event.weekday = eventdate.format("ddd");
          event.date = eventdate.format("DD.MM.YY");
          event.location="ifz";
          event.id=uuidv4();
          return true;
        }
      }
    });

    return weekendeventlist;
  }
  let allweekendeventlist = getAllWeekendEventList(alleventlist, currentdate);
  console.log(allweekendeventlist);
  res.status(200);
  res.json(allweekendeventlist);
};

export { getWeekendEventList, getAllWeekendEventList };
