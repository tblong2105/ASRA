package com.asra.developer.models.payload.response;

import java.util.List;

import com.asra.developer.models.payload.response.vo.GetAllDepositVO;

public class GetAllDepositResponse {
	
	private List<GetAllDepositVO> deposits;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public GetAllDepositResponse() {

	}

	public List<GetAllDepositVO> getDeposits() {
		return deposits;
	}

	public void setDeposits(List<GetAllDepositVO> deposits) {
		this.deposits = deposits;
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
