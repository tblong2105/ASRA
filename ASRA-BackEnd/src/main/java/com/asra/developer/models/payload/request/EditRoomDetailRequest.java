package com.asra.developer.models.payload.request;

public class EditRoomDetailRequest {

	private Long roomDetailId;

	private String roomNo;

	public EditRoomDetailRequest() {

	}

	public EditRoomDetailRequest(String roomNo) {
		super();
		this.roomNo = roomNo;
	}

	public Long getRoomDetailId() {
		return roomDetailId;
	}

	public void setRoomDetailId(Long roomDetailId) {
		this.roomDetailId = roomDetailId;
	}

	public String getRoomNo() {
		return roomNo;
	}

	public void setRoomNo(String roomNo) {
		this.roomNo = roomNo;
	}

}
