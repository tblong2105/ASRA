package com.asra.developer.models.payload.request;

public class MyRoomRequest {

	private Long id;
	private Integer page;

	public MyRoomRequest() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

}
