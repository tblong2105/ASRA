package com.asra.developer.models.payload.response;

public class CreateRoomResponse {

	private Long roomId;

	private MessageResponse message;

	public CreateRoomResponse() {

	}

	public CreateRoomResponse(Long roomId, MessageResponse message) {
		super();
		this.roomId = roomId;
		this.message = message;
	}

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public MessageResponse getMessage() {
		return message;
	}

	public void setMessage(MessageResponse message) {
		this.message = message;
	}

}
