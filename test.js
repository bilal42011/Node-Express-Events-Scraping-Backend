let puppeteer=require("puppeteer");

(async()=>{
    let browser= await puppeteer.launch({headless:false,devtools:true});
    let page=await browser.newPage();
    await page.goto("https://ifz.me/");
    let elements=await page.$$('a[href*="2022-05"]');
    for(let event of elements){
let date=event.querySelector("event-teaser__date").innerText;
console.log(date);
    }
})();