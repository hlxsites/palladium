package com.adobe.playground.tools.lhsbot;

import java.util.Date;

public class Score {

	public String url, performance, accessibility, bestpractices, seo;
	public Date captureDate;
	private String screenshot;

	public Score(String url, String performance, String accessibility, String bestpractices, String seo,
			String screenshot) {
		this.performance = performance;
		this.accessibility = accessibility;
		this.bestpractices = bestpractices;
		this.seo = seo;
		this.url = url;
		this.screenshot = screenshot;
		this.captureDate = new Date();
	}

	/*
	 * returns CSV
	 */
	@Override
	public String toString() {
		return url + "," + performance + "," + accessibility + "," + bestpractices + "," + seo + "," + screenshot + ","
				+ captureDate;
	}

	public static String toStringHeader() {
		return "URL,Performance,Accessibility,BestPractices,SEO,Screenshot,date";
	}
}
