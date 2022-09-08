package com.asra.developer.models.payload.response.admin;

import com.asra.developer.models.payload.response.vo.AdminDashBoardMonthlyVO;
import com.asra.developer.models.payload.response.vo.AdminDashBoardStatusVO;

public class GetDashBoardResponse {
	private int totalRoom;
	private int totalContract;
	private int totalAccount;
	private AdminDashBoardMonthlyVO monthContract;
	private AdminDashBoardStatusVO statusContract;

	public int getTotalRoom() {
		return totalRoom;
	}

	public void setTotalRoom(int totalRoom) {
		this.totalRoom = totalRoom;
	}

	public int getTotalContract() {
		return totalContract;
	}

	public void setTotalContract(int totalContract) {
		this.totalContract = totalContract;
	}

	public int getTotalAccount() {
		return totalAccount;
	}

	public void setTotalAccount(int totalAccount) {
		this.totalAccount = totalAccount;
	}

	public AdminDashBoardMonthlyVO getMonthContract() {
		return monthContract;
	}

	public void setMonthContract(AdminDashBoardMonthlyVO monthContract) {
		this.monthContract = monthContract;
	}

	public AdminDashBoardStatusVO getStatusContract() {
		return statusContract;
	}

	public void setStatusContract(AdminDashBoardStatusVO statusContract) {
		this.statusContract = statusContract;
	}

}
