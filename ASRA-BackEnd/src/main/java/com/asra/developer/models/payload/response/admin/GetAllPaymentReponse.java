package com.asra.developer.models.payload.response.admin;

import java.util.List;

import com.asra.developer.models.payload.response.vo.GetAllPaymentVO;

public class GetAllPaymentReponse {
	private List<GetAllPaymentVO> allPaymentVOs;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public GetAllPaymentReponse() {
	}

	public List<GetAllPaymentVO> getAllPaymentVOs() {
		return allPaymentVOs;
	}

	public void setAllPaymentVOs(List<GetAllPaymentVO> allPaymentVOs) {
		this.allPaymentVOs = allPaymentVOs;
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
