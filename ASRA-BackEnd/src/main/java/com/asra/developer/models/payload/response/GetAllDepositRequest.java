package com.asra.developer.models.payload.response;

public class GetAllDepositRequest {
	
	private int page;
	
	private long roomId;

	private String keyword;

	private String sortBy;

	private String sortField;

	private String status;

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public long getRoomId() {
		return roomId;
	}

	public void setRoomId(long roomId) {
		this.roomId = roomId;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getSortBy() {
		return sortBy;
	}

	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}

	public String getSortField() {
		return sortField;
	}

	public void setSortField(String sortField) {
		this.sortField = sortField;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
