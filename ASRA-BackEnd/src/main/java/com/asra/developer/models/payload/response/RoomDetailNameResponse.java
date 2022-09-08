package com.asra.developer.models.payload.response;

public class RoomDetailNameResponse {

	private Long id;

	private String roomNo;

	public RoomDetailNameResponse() {

	}

	public RoomDetailNameResponse(Long id, String roomNo) {
		super();
		this.id = id;
		this.roomNo = roomNo;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRoomNo() {
		return roomNo;
	}

	public void setRoomNo(String roomNo) {
		this.roomNo = roomNo;
	}

	@Override
	public String toString() {
		return "RoomDetailNameResponse [id=" + id + ", roomNo=" + roomNo + "]";
	}

}
