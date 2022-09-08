package com.asra.developer.models.payload.response;

import com.asra.developer.common.error.MessageModel;

public class EditRoomDetailResponse {

	private MessageModel message;

	public EditRoomDetailResponse() {

	}

	public EditRoomDetailResponse(MessageModel message) {
		super();
		this.message = message;
	}

	public MessageModel getMessage() {
		return message;
	}

	public void setMessage(MessageModel message) {
		this.message = message;
	}

}
