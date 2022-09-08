package com.asra.developer.models.payload.response.vo;

import java.math.BigDecimal;
import java.util.Date;

public class GetAllDepositVO {
	private long id;

	private long roomId;

	private String thubnailImage;

	private String address;

	private BigDecimal depositCost;

	private String innkeeperName;

	private String innkeeperPhone;

	private Date createdDate;

	private String status;

	public GetAllDepositVO() {

	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getRoomId() {
		return roomId;
	}

	public void setRoomId(long roomId) {
		this.roomId = roomId;
	}

	public String getThubnailImage() {
		return thubnailImage;
	}

	public void setThubnailImage(String thubnailImage) {
		this.thubnailImage = thubnailImage;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public BigDecimal getDepositCost() {
		return depositCost;
	}

	public void setDepositCost(BigDecimal depositCost) {
		this.depositCost = depositCost;
	}

	public String getInnkeeperName() {
		return innkeeperName;
	}

	public void setInnkeeperName(String innkeeperName) {
		this.innkeeperName = innkeeperName;
	}

	public String getInnkeeperPhone() {
		return innkeeperPhone;
	}

	public void setInnkeeperPhone(String innkeeperPhone) {
		this.innkeeperPhone = innkeeperPhone;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
