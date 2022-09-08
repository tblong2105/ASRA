package com.asra.developer.models.payload.response;

import java.util.List;

import com.asra.developer.models.payload.response.vo.MyRoomResponseVO;

public class MyRoomResponse {

	private List<MyRoomResponseVO> rooms;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public MyRoomResponse() {

	}

	public MyRoomResponse(List<MyRoomResponseVO> rooms) {
		super();
		this.rooms = rooms;
	}

	public List<MyRoomResponseVO> getRooms() {
		return rooms;
	}

	public void setRooms(List<MyRoomResponseVO> rooms) {
		this.rooms = rooms;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getTotalItems() {
		return totalItems;
	}

	public void setTotalItems(int totalItems) {
		this.totalItems = totalItems;
	}

	public int getTotalPages() {
		return totalPages;
	}

	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}

}
