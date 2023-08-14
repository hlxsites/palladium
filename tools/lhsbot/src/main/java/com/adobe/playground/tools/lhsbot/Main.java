package com.adobe.playground.tools.lhsbot;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.assertthat.selenium_shutterbug.core.Capture;
import com.assertthat.selenium_shutterbug.core.Shutterbug;

public class Main {

	private static final String WAIT_FOR_LH_REPORT = "lh-report";
	private static final String CAPTURE_CSV = "lhs-scores.csv";
	private static final String XPATH_GAUGE = "(//*[@class='lh-gauge__label' and contains(text(),'{TYPE}')])[1]/parent::*/div[@class='lh-gauge__percentage']";
	private static final String TYPE_PERFORMANCE = "Performance";
	private static final String TYPE_ACCESSIBILITY = "Accessibility";
	private static final String TYPE_BESTPRACTICES = "Best Practices";
	private static final String TYPE_SEO = "SEO";
	private static ChromeOptions options;

	public static void main(String... args) {
		if (new File(CAPTURE_CSV).exists()) {
			System.out.println("lhs-scores.csv already exists, do not overwrite... stop.");
			System.exit(0);
		}
		setup();
		List<Score> allScores = new ArrayList<Score>();
		try {
			int current = 0;
			List<String> allLines = Files.readAllLines(Paths.get("captureUrls.txt"));
			for (String url : allLines) {
				current++;
				System.out.println("Analyze " + current + "/" + allLines.size() + ": " + url);
				Score score = analyze(url);
				allScores.add(score);
			}
			output(allScores);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private static void output(List<Score> allScores) {
		Path path = Paths.get(CAPTURE_CSV);
		try (BufferedWriter writer = Files.newBufferedWriter(path, Charset.forName("UTF-8"))) {
			writer.write(Score.toStringHeader() + "\n");
			for (Score score : allScores) {
				writer.write(score.toString() + "\n");
			}
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	private static Score analyze(String url) {
		WebDriver driver = new ChromeDriver(options);
		driver.navigate().to("https://pagespeed.web.dev/analysis?url=" + url);

		WebDriverWait w = new WebDriverWait(driver, Duration.ofMinutes(1));
		w.until(ExpectedConditions.visibilityOfElementLocated(By.className(WAIT_FOR_LH_REPORT)));

		UUID guid = java.util.UUID.randomUUID();
		String screenshotPath = "screenshots/" + guid + ".png";
		Shutterbug.shootPage(driver, Capture.FULL, true).withName(guid.toString()).save();

		String performance = extractGauge(driver, TYPE_PERFORMANCE);
		String accessibility = extractGauge(driver, TYPE_ACCESSIBILITY);
		String seo = extractGauge(driver, TYPE_SEO);
		String bestpractices = extractGauge(driver, TYPE_BESTPRACTICES);
		System.out.println("  - Performance: " + performance);
		System.out.println("  - Accessibility: " + accessibility);
		System.out.println("  - Best Practices: " + bestpractices);
		System.out.println("  - SEO: " + seo);
		driver.close();
		return new Score(url, performance, accessibility, bestpractices, seo, screenshotPath);
	}

	private static void setup() {
		System.setProperty("webdriver.chrome.driver", "/Users/rliechti/adobe/tools/chromedriver");
		options = new ChromeOptions();
		options.addArguments("--headless", "--window-size=1920,1200");
		// options.addArguments("--window-size=1920,1200");
	}

	private static String extractGauge(WebDriver driver, String type) {
		return driver.findElement(By.xpath(XPATH_GAUGE.replace("{TYPE}", type))).getAttribute("innerText");
	}

}