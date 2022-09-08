package com.asra.developer.common.enums;

public enum ERoomTypes {

	DORMITORY("R01"), ROOM_FOR_RENT("R02"), APARTMENT("R03"), WHOLE_HOUSE("R04"), SHARED_ROOM("R05");

	private String value;

	private ERoomTypes(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
