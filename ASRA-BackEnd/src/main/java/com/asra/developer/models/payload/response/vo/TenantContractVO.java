package com.asra.developer.models.payload.response.vo;

import java.math.BigDecimal;
import java.util.Date;

public class TenantContractVO {
	private Long id;

	private String title;

	private String address;

	private String roomNo;

	private BigDecimal rentalPrice;

	private String tenantName;

	private String tenantPhone;

	private String innkeeperName;

	private String innkeeperPhone;

	private Date contractCreateDate;
	
	private long roomId;
	
	private String innkeeperUsername;

	public TenantContractVO() {
		
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getRoomNo() {
		return roomNo;
	}

	public void setRoomNo(String roomNo) {
		this.roomNo = roomNo;
	}

	public BigDecimal getRentalPrice() {
		return rentalPrice;
	}

	public void setRentalPrice(BigDecimal rentalPrice) {
		this.rentalPrice = rentalPrice;
	}

	public String getTenantName() {
		return tenantName;
	}

	public void setTenantName(String tenantName) {
		this.tenantName = tenantName;
	}

	public String getTenantPhone() {
		return tenantPhone;
	}

	public void setTenantPhone(String tenantPhone) {
		this.tenantPhone = tenantPhone;
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

	public Date getContractCreateDate() {
		return contractCreateDate;
	}

	public void setContractCreateDate(Date contractCreateDate) {
		this.contractCreateDate = contractCreateDate;
	}

	public long getRoomId() {
		return roomId;
	}

	public void setRoomId(long roomId) {
		this.roomId = roomId;
	}

	public String getInnkeeperUsername() {
		return innkeeperUsername;
	}

	public void setInnkeeperUsername(String innkeeperUsername) {
		this.innkeeperUsername = innkeeperUsername;
	}

}
