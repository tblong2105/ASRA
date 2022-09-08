package com.asra.developer.models.payload.response;

import java.math.BigDecimal;
import java.util.Date;

public class DetailRoomWithContractResponse {

	private BigDecimal rentalPrice;

	private BigDecimal electronicPrice;

	private BigDecimal waterPrice;

	private BigDecimal internetPrice;
	
	private Date startDate;

	private Date endDate;
	
	private long id;

	public DetailRoomWithContractResponse() {

	}

	public DetailRoomWithContractResponse(BigDecimal rentalPrice, BigDecimal electronicPrice, BigDecimal waterPrice,
			BigDecimal internetPrice) {
		super();
		this.rentalPrice = rentalPrice;
		this.electronicPrice = electronicPrice;
		this.waterPrice = waterPrice;
		this.internetPrice = internetPrice;
	}

	
	
	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public BigDecimal getRentalPrice() {
		return rentalPrice;
	}

	public void setRentalPrice(BigDecimal rentalPrice) {
		this.rentalPrice = rentalPrice;
	}

	public BigDecimal getElectronicPrice() {
		return electronicPrice;
	}

	public void setElectronicPrice(BigDecimal electronicPrice) {
		this.electronicPrice = electronicPrice;
	}

	public BigDecimal getWaterPrice() {
		return waterPrice;
	}

	public void setWaterPrice(BigDecimal waterPrice) {
		this.waterPrice = waterPrice;
	}

	public BigDecimal getInternetPrice() {
		return internetPrice;
	}

	public void setInternetPrice(BigDecimal internetPrice) {
		this.internetPrice = internetPrice;
	}

}
