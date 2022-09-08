package com.asra.developer.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class DateTimeUtil {

	public static String convertDayNumberToYearWeekDayFormat(String startDate, String endDate) throws ParseException {
		int year, week, day;

		SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss.SS", Locale.ENGLISH);
		Date firstDate = sdf.parse(startDate);
		Date secondDate = sdf.parse(endDate);

		long diffInMillies = Math.abs(secondDate.getTime() - firstDate.getTime());
		long diff = (int) TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);

		year = (int) diff / 365;
		diff = diff % 365;
		System.out.println("No. of years:" + year);
		week = (int) diff / 7;
		diff = diff % 7;
		System.out.println("No. of weeks:" + week);
		day = (int) diff;
		System.out.println("No. of days:" + day);
		return year + " year" + week + " week" + day + " day";
	}

	public static Date convertStringToDate(String dateStr) throws ParseException {
		Date date = new SimpleDateFormat("MMM dd yyyy").parse(dateStr);
		return date;
	}

}
