package com.asra.developer.models.payload.response;

import java.io.Serializable;

import com.asra.developer.common.error.MessageModel;

public class MessageResponse implements Serializable {

	private static final long serialVersionUID = 1L;

	private MessageModel message;

	public MessageResponse() {

	}

	public MessageResponse(MessageModel message) {
		super();
		this.message = message;
	}

	public MessageResponse(String messageId) {
		this.message = new MessageModel(messageId);
	}

	public MessageModel getMessage() {
		return message;
	}

	public void setMessage(MessageModel message) {
		this.message = message;
	}

}
