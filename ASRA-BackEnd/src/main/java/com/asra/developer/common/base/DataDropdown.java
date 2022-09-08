package com.asra.developer.common.base;

public class DataDropdown {

	private Long key;

	private String valueText;

	public DataDropdown(Long key, String valueText) {
		super();
		this.key = key;
		this.valueText = valueText;
	}

	public Long getKey() {
		return key;
	}

	public void setKey(Long key) {
		this.key = key;
	}

	public String getValueText() {
		return valueText;
	}

	public void setValueText(String valueText) {
		this.valueText = valueText;
	}

}
