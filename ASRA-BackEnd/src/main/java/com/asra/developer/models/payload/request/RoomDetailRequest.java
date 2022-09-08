package com.asra.developer.models.payload.request;

public class RoomDetailRequest {

	private Long accountId;

	private String roomId;

	private Boolean accessPath;

	public RoomDetailRequest() {

	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
	}

	public String getRoomId() {
		return roomId;
	}

	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}

	public Boolean getAccessPath() {
		return accessPath;
	}

	public void setAccessPath(Boolean accessPath) {
		this.accessPath = accessPath;
	}

}
