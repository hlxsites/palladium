package com.adobe.playground.tools.lhsbot;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class Main {

	private static final String CAPTURE_CSV = "lhs-scores.csv";
	private static final int MAX_THREADS = 5;
	private static final Set<Score> allScores = ConcurrentHashMap.newKeySet();

	public static void main(String... args) throws Exception {
		long start = System.currentTimeMillis();
		setupGlobal();
		ExecutorService es = setupExecutorService();
		waitForTasksToFinish(es);
		output();
		System.out.println("Took " + ((System.currentTimeMillis() - start) / 1000) + "s");
	}

	private static void waitForTasksToFinish(ExecutorService es) throws InterruptedException {
		es.shutdown();
		while (!es.isTerminated()) {
			int tasksLeft = ((ThreadPoolExecutor) es).getQueue().size() + ((ThreadPoolExecutor) es).getActiveCount();
			System.out.println("Remainers: " + tasksLeft);
			Thread.sleep(2500);
		}
		try {
			es.awaitTermination(Long.MAX_VALUE, TimeUnit.NANOSECONDS);
		} catch (InterruptedException e) {
			System.out.println(e);
		}
	}

	private static ExecutorService setupExecutorService() throws IOException {
		ExecutorService es = Executors.newFixedThreadPool(MAX_THREADS);
		List<String> allLines = Files.readAllLines(Paths.get("captureUrls.txt"));
		for (String url : allLines) {
			System.out.println("Prepare: " + url);
			LHSRunnable r = new LHSRunnable(allScores, url);
			es.execute(r);
		}
		return es;
	}

	private static void output() {
		List<Score> sortedResults = new ArrayList<Score>(allScores);
		Collections.sort(sortedResults, new Comparator<Score>() {
			@Override
			public int compare(Score o1, Score o2) {
				return o1.nr.compareTo(o2.nr);
			}
		});
		Path path = Paths.get(CAPTURE_CSV);
		try (BufferedWriter writer = Files.newBufferedWriter(path, Charset.forName("UTF-8"))) {
			writer.write(Score.toStringHeader() + "\n");
			for (Score score : sortedResults) {
				writer.write(score.toString() + "\n");
			}
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}

	private static void setupGlobal() {
		if (System.getProperty("webdriver.chrome.driver", null) == null) {
			System.setProperty("webdriver.chrome.driver",
					"/Users/" + System.getenv("USER") + "/adobe/tools/chromedriver");
		}
		System.out.println("Using chrome driver " + System.getProperty("webdriver.chrome.driver"));

		if (new File(CAPTURE_CSV).exists()) {
			System.out.println("lhs-scores.csv already exists, do not overwrite... stop.");
			System.exit(0);
		}
	}

}