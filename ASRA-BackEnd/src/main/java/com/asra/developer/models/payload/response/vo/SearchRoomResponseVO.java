package com.asra.developer.models.payload.response.vo;

import java.math.BigDecimal;

public class SearchRoomResponseVO {

	private Long id;

	private String title;

	private BigDecimal roomArea;

	private BigDecimal rentalPrice;

	private BigDecimal electricityCost;

	private BigDecimal waterCost;

	private String thubnailImage;

	private String address;

	private String roomType;

	public SearchRoomResponseVO() {

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

	public BigDecimal getRoomArea() {
		return roomArea;
	}

	public void setRoomArea(BigDecimal roomArea) {
		this.roomArea = roomArea;
	}

	public BigDecimal getRentalPrice() {
		return rentalPrice;
	}

	public void setRentalPrice(BigDecimal rentalPrice) {
		this.rentalPrice = rentalPrice;
	}

	public BigDecimal getElectricityCost() {
		return electricityCost;
	}

	public void setElectricityCost(BigDecimal electricityCost) {
		this.electricityCost = electricityCost;
	}

	public BigDecimal getWaterCost() {
		return waterCost;
	}

	public void setWaterCost(BigDecimal waterCost) {
		this.waterCost = waterCost;
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

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

}
