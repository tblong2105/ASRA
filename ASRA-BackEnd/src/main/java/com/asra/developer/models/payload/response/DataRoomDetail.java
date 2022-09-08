package com.asra.developer.models.payload.response;

import com.asra.developer.common.base.DataDropdown;

public class DataRoomDetail extends DataDropdown {

	private Boolean status;

	public DataRoomDetail(Long key, String value) {
		super(key, value);
	}

	public DataRoomDetail(Long key, String value, Boolean status) {
		super(key, value);
		this.status = status;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

}
