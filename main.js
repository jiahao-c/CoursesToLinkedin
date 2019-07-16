'use strict';

//fill in your minerva credentials
const MG_USR = '@mail.mcgill.ca';
const MG_PW = '';

//fill in your linkedin credentials
const LI_USR = ''; //email address
const LI_PW = '';

const pptr = require('puppeteer');
(async () => {
  const browser = await pptr.launch({
    headless: false
  });
  const minerva = await browser.newPage();
  const baseURL = 'https://horizon.mcgill.ca/pban1/'

  //log in minerva
  await minerva.goto(baseURL + 'twbkwbis.P_WWWLogin');
  await minerva.type('#mcg_un', MG_USR);
  await minerva.type('#mcg_pw', MG_PW);
  await minerva.click('#mcg_un_submit');
  await minerva.goto(baseURL + 'bzsktran.P_Display_Form?user_type=S&tran_type=V');

  //get courses in [courseNumber,courseName] format
  const courses = await minerva.evaluate(() => {
    let data = [];
    const rows = document.querySelectorAll('body > div.pagebodydiv > table:nth-child(7) > tbody > tr');
    rows.forEach(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells.length == 11 && cells[1].innerText.length != 0) {
        let courseNumber = cells[1].innerText;
        let courseName = cells[3].innerText;
        data.push([courseNumber, courseName]);
      }
    });
    return data;
  });

  const linkedin = await browser.newPage();
  //log in Linkedin
  await linkedin.goto('https://www.linkedin.com/login?trk=guest_homepage-basic_nav-header-signin', { waitUntil: 'networkidle0' });
  await linkedin.click('#username');
  await linkedin.keyboard.type(LI_USR);
  await linkedin.click('#password');
  await linkedin.keyboard.type(LI_PW);
  await linkedin.click('.btn__primary--large.from__button--floating');
  await linkedin.waitForSelector("a[data-control-name='identity_welcome_message']");

  //go to course-add
  await linkedin.goto('https://www.linkedin.com/in/');
  await linkedin.waitForSelector('#profile-wrapper');
  const newCourseURL = linkedin.url() + 'edit/course/new/';

  //add courses record one-by-one
  for (const course of courses) {
    await linkedin.goto(newCourseURL);
    await linkedin.waitForSelector('#course-occupation');
    await linkedin.click('#course-name');
    await linkedin.type('#course-name', course[1]);
    await linkedin.click('#course-number');
    await linkedin.type('#course-number', course[0]);
    //select mcgill in occupations
    await linkedin.click('#course-occupation');
    const options = (await linkedin.$$('#course-occupation > option'));
    for (const option of options) {
      let optionText = (await (await option.getProperty('textContent')).jsonValue());
      if (optionText.includes('McGill')) {
        let optionValue = (await (await option.getProperty('value')).jsonValue());
        await linkedin.select('#course-occupation', optionValue);
      }
    }
    const submitButton = (await linkedin.$$("button[type='submit']"))[1];
    await submitButton.click();
    await linkedin.waitFor(() => !document.querySelector("button[type='submit']"));
  }
  await browser.close(); 
})();