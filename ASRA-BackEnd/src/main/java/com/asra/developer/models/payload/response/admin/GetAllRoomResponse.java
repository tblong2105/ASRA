package com.asra.developer.models.payload.response.admin;

import java.io.Serializable;
import java.util.List;

import com.asra.developer.models.payload.response.vo.GetAllRoomVO;

public class GetAllRoomResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<GetAllRoomVO> rooms;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public GetAllRoomResponse() {

	}

	public List<GetAllRoomVO> getRooms() {
		return rooms;
	}

	public void setRooms(List<GetAllRoomVO> rooms) {
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
