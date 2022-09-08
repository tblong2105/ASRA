package com.asra.developer.models.payload.response.vo;

public class AdminDashBoardMonthlyVO {
	private String[] month;
	private int[] contractCount;

	public String[] getMonth() {
		return month;
	}

	public void setMonth(String[] month) {
		this.month = month;
	}

	public int[] getContractCount() {
		return contractCount;
	}

	public void setContractCount(int[] contractCount) {
		this.contractCount = contractCount;
	}

}
