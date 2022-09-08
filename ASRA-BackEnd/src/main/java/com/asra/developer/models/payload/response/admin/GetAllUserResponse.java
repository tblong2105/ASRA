package com.asra.developer.models.payload.response.admin;

import java.io.Serializable;
import java.util.List;

import com.asra.developer.models.payload.response.vo.GetAllUserVO;

public class GetAllUserResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<GetAllUserVO> users;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public GetAllUserResponse() {

	}

	public List<GetAllUserVO> getUsers() {
		return users;
	}

	public void setUsers(List<GetAllUserVO> users) {
		this.users = users;
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
