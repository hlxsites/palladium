package com.adobe.playground.tools.lhsbot;

import java.time.Duration;
import java.util.Set;
import java.util.UUID;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.assertthat.selenium_shutterbug.core.Capture;
import com.assertthat.selenium_shutterbug.core.Shutterbug;

public class LHSRunnable implements Runnable {

	private static final String WAIT_FOR_LH_REPORT = "lh-report";
	private static final String XPATH_GAUGE = "(//*[@class='lh-gauge__label' and contains(text(),'{TYPE}')])[1]/parent::*/div[@class='lh-gauge__percentage']";
	private static final String TYPE_PERFORMANCE = "Performance";
	private static final String TYPE_ACCESSIBILITY = "Accessibility";
	private static final String TYPE_BESTPRACTICES = "Best Practices";
	private static final String TYPE_SEO = "SEO";
	private static ChromeOptions options;

	private Score score = new Score();
	private Set<Score> allScores;
	private String url;

	public LHSRunnable(Set<Score> allScores, String url) {
		this.allScores = allScores;
		options = new ChromeOptions();
		options.addArguments("--headless", "--window-size=1920,1200");
		this.url = url;
	}

	@Override
	public void run() {
		System.out.println("Start analysis on " + url);
		WebDriver driver = new ChromeDriver(options);
		driver.navigate().to("https://pagespeed.web.dev/analysis?url=" + url);

		WebDriverWait w = new WebDriverWait(driver, Duration.ofMinutes(1));
		w.until(ExpectedConditions.visibilityOfElementLocated(By.className(WAIT_FOR_LH_REPORT)));

		UUID guid = java.util.UUID.randomUUID();
		Shutterbug.shootPage(driver, Capture.FULL, true).withName(guid.toString()).save();

		String performance = extractGauge(driver, TYPE_PERFORMANCE);
		String accessibility = extractGauge(driver, TYPE_ACCESSIBILITY);
		String seo = extractGauge(driver, TYPE_SEO);
		String bestpractices = extractGauge(driver, TYPE_BESTPRACTICES);
		StringBuilder b = new StringBuilder("Analyzed ").append(url).append(": Performance ").append(performance)
				.append(" - Accessibility ").append(accessibility).append(" - Best Practices ").append(bestpractices)
				.append(" - SEO ").append(seo);
		System.out.println(b);
		driver.close();
		score.accessibility = accessibility;
		score.bestpractices = bestpractices;
		score.performance = performance;
		score.seo = seo;
		score.url = url;
		allScores.add(score);
	}

	private static String extractGauge(WebDriver driver, String type) {
		return driver.findElement(By.xpath(XPATH_GAUGE.replace("{TYPE}", type))).getAttribute("innerText");
	}

}
