# A first prototype of a Google Lighthouse Score Bot
This bot helps to build a table of LHScores for many urls, without the need to manually trigger and document.
## Feature support
- call LHS service
- take a screenshot
- grab the KPIs for performance, accessibility, best practices and seo and document it in a comma seperated value file

## background
The tool uses selenium with a chrome driver to load a new google chrome instance, calling the https://pagespeed.web.dev to run the LHS and waits for the report to be visible. Once the report is there, a screenshot of the entire page is stored with a unique GUID, which later is then referred from the CSV next to the results of the KPIs.

## Dependencies
- selenium: https://www.selenium.dev/
- chrome: https://www.google.com/intl/de/chrome/
- chromedriver: https://chromedriver.chromium.org/
- shutterbug: https://github.com/assertthat/selenium-shutterbug

## setup
- download chrome, install it
- download chrome driver. On mac, chrome dreiver is prevented to be opened at first. Open it manually where you need to confirm that this unknown software is allowed to run. see https://www.swtestacademy.com/install-chrome-driver-on-mac/
- define the system env 'webdriver.chrome.driver' to point to your chrome driver, or put the chrome driver to ~/adobe/tools/chromedriver

## how to run the LHS bot
- define a list of URLs in a file named 'captureUrls.txt'
- build the tool using 'mvn clean install'
- run the tool using 'mvn exec:java'
- wait for it to end, find below output

### verbose output
while running, the tool prints to the console some stats, such as
- run od runs with URL
- the 4 LHS kpis grabbed

```
Analyze 3/18: https://www.palladiumhotelgroup.com/es/cares/4-causas/infancia/padel-silla-menorca/
  - Performance: 29
  - Accessibility: 73
  - Best Practices: 68
  - SEO: 70
```

## generated artifacts
- the tool builds a CSV with all the scored, the URL and a link to the screenshot: lhs-scores.csv
- for each url, a screenshot is stored with a unique GUID as a name within the screenshot folder
