package com.asra.developer.models.payload.response;

public class DataMaster {
	private String name;

	private String value;

	public DataMaster() {

	}

	public DataMaster(String name, String value) {
		super();
		this.name = name;
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

}
