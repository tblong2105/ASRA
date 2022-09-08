package com.asra.developer.models.payload.response.vo;

public class AdminDashBoardStatusVO {
	private String[] statusName;
	private int[] countContract;

	public String[] getStatusName() {
		return statusName;
	}

	public void setStatusName(String[] statusName) {
		this.statusName = statusName;
	}

	public int[] getCountContract() {
		return countContract;
	}

	public void setCountContract(int[] countContract) {
		this.countContract = countContract;
	}

}
