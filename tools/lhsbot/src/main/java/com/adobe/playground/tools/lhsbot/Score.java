package com.adobe.playground.tools.lhsbot;

import java.util.Date;

public class Score {

	private static int nextRun = 0;

	Integer nr;
	String url, performance, accessibility, bestpractices, seo,screenshot;
	Date captureDate;

	public Score() {
		nr = ++nextRun;
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
