package com.asra.developer.models.payload.response;

import java.util.List;

import com.asra.developer.models.payload.response.vo.TenantContractVO;

public class ListContractWaitResponse {

	private List<TenantContractVO> contractVOs;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public ListContractWaitResponse() {

	}

	public List<TenantContractVO> getContractVOs() {
		return contractVOs;
	}

	public void setContractVOs(List<TenantContractVO> contractVOs) {
		this.contractVOs = contractVOs;
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
