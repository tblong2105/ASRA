package com.asra.developer.common.utils;

import com.asra.developer.models.entity.AddressMaster;

public class StringUtil {

	public static final String EMPTY = "";

	public static final String COMMA_SPACE = ", ";

	public static String nullToEmpty(String value) {
		return value != null ? value : EMPTY;
	}

	public static String nullToEmpty(Object value) {
		return value != null ? value.toString() : EMPTY;
	}

	public static boolean isEmpty(String value) {
		return value == null || value.isEmpty();
	}

	public static boolean isBlank(String value) {
		return value == null || value.isBlank();
	}

	public static boolean isNotEmpty(String value) {
		return !isEmpty(value);
	}

	public static boolean isNotBlank(String value) {
		return !isBlank(value);
	}

	public static String getAddressFromDB(AddressMaster addressMaster) {
		StringBuilder sb = new StringBuilder();

		if (addressMaster != null) {
			sb.append(addressMaster.getStreetName());
			sb.append(COMMA_SPACE);
			sb.append(addressMaster.getWard());
			sb.append(COMMA_SPACE);
			sb.append(addressMaster.getDistrict());
			sb.append(COMMA_SPACE);
			sb.append(addressMaster.getCity());
		}

		return sb.toString();
	}
}
