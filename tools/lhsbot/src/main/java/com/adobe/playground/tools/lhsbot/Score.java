package com.adobe.playground.tools.lhsbot;

import java.util.Date;

public class Score {

	private static int nextRun = 0;

	private int nr;

	String url, performance, accessibility, bestpractices, seo;
	private Date captureDate;
	private String screenshot;

	public Score() {
		captureDate = new Date();
		nr = ++nextRun;
	}

	public Integer getNr() {
		return nr;
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
