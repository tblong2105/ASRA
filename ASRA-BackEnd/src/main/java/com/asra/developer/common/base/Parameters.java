package com.asra.developer.common.base;

import java.util.HashMap;
import java.util.Map;

public class Parameters {
	private Map<String, Object> params = new HashMap<>();

	public Parameters() {

	}

	public void add(String key, Object value) {
		this.params.put(key, value);
	}

	public Object get(String key) {
		return params.get(key);

	}
}
