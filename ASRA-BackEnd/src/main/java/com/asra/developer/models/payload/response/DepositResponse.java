package com.asra.developer.models.payload.response;

import java.io.Serializable;
import java.util.List;

import com.asra.developer.models.payload.response.vo.DepositResponseVO;

public class DepositResponse implements Serializable {

	private static final long serialVersionUID = 1L;

	private List<DepositResponseVO> deposits;

	private int currentPage;

	private int totalItems;

	private int totalPages;

	public DepositResponse() {

	}

	public List<DepositResponseVO> getDeposits() {
		return deposits;
	}

	public void setDeposits(List<DepositResponseVO> deposits) {
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

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
