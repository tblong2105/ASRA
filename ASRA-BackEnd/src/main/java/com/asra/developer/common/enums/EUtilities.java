package com.asra.developer.common.enums;

public enum EUtilities {
	BED("U01"), WM("U02"), TIME("U03"), AC("U04"), TELEVISION("U05"), REFRIGERATOR("U06"), WIFI("U07"), PARKING("U08"),
	TOILET("U09"), KITCHEN("U10");

	private String value;

	private EUtilities(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
