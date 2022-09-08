package com.asra.developer.models.payload.response.admin;

import java.io.Serializable;
import java.util.List;

import com.asra.developer.models.payload.response.vo.GetAllInnkeeperVO;

public class GetAllBecomeInnkeeperResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<GetAllInnkeeperVO> innkeepers;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public GetAllBecomeInnkeeperResponse() {

	}

	public List<GetAllInnkeeperVO> getInnkeepers() {
		return innkeepers;
	}

	public void setInnkeepers(List<GetAllInnkeeperVO> innkeepers) {
		this.innkeepers = innkeepers;
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
