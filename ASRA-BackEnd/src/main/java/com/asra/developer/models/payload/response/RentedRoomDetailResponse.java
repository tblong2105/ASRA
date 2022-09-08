package com.asra.developer.models.payload.response;

public class RentedRoomDetailResponse {

	private Long roomDetailId;

	private String roomNo;

	private String status;

	public RentedRoomDetailResponse() {

	}

	public RentedRoomDetailResponse(Long roomDetailId, String roomNo, String status) {
		this.roomDetailId = roomDetailId;
		this.roomNo = roomNo;
		this.status = status;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
