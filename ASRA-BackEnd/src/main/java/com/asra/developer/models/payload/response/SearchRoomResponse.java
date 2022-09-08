package com.asra.developer.models.payload.response;

import java.io.Serializable;
import java.util.List;

import com.asra.developer.models.payload.response.vo.SearchRoomResponseVO;

public class SearchRoomResponse implements Serializable {

	private static final long serialVersionUID = 1L;

	private List<SearchRoomResponseVO> rooms;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public SearchRoomResponse() {

	}

	public List<SearchRoomResponseVO> getRooms() {
		return rooms;
	}

	public void setRooms(List<SearchRoomResponseVO> rooms) {
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

	@Override
	public String toString() {
		return "SearchRoomResponse [rooms=" + rooms + ", currentPage=" + currentPage + ", totalItems=" + totalItems
				+ ", totalPages=" + totalPages + "]";
	}

}
