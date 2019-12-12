# CoursesToLinkedin
Automatically export courses from McGill Minerva to Linkedin
![demo](https://cdn.jsdelivr.net/gh/jhcccc/CoursesToLinkedin@master/img/demo.gif)

# Background
You worked hard at McGill, you want to show the courses you took on Linkedin.
Manually adding them one-by-one is boring and tedious. This tool can help you with it, so that you can save precious time & effort :p

## Is it safe to fill in my credentials?
This project is fully open-source. You run the code on your local machine. Feel free to read the code as it's only 80 lines.

## Why Puppeteer?
Linkedin only issues API key to companies, not individual developers.

# Dependency Installation
Navigate to project folder, then `npm i puppeteer`

If you don't have node.js, you may install with homebrew or go [nodejs.org](https://nodejs.org)

# Usage
- Install dependency (node, puppeteer)
- Download `main.js`
- Fill in your credentials
- Run with `node main.js`
- (optional) change `headless: false` to `headless: true`, so that the browser does not show up.
