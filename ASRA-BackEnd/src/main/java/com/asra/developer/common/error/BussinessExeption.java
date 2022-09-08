package com.asra.developer.common.error;

import java.util.Arrays;

public class BussinessExeption extends RuntimeException {

	private static final long serialVersionUID = 1L;

	private String messageId;

	private Object[] params;

	public BussinessExeption() {
		super();
	}

	public BussinessExeption(String messageId, Object... params) {
		super();
		this.messageId = messageId;
		this.params = params;
	}

	public BussinessExeption(Throwable e) {
		super(e);
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public Object[] getParams() {
		return Arrays.copyOf(this.params, this.params.length);
	}

	public void setParams(Object[] params) {
		this.params = params;
	}

}
