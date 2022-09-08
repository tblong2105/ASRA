package com.asra.developer.models.payload.request;

import java.math.BigDecimal;

public class SendMailMonthlyVO {

	private long billId;

	private String roomName;

	private String roomDetailId;

	private int year;

	private int month;

	private int day;

	private BigDecimal totalBill;

	private BigDecimal rentalPrice;

	private BigDecimal electronicPrice;

	private BigDecimal waterPrice;

	private BigDecimal internetPrice;

	public long getBillId() {
		return billId;
	}

	public void setBillId(long billId) {
		this.billId = billId;
	}

	public String getRoomName() {
		return roomName;
	}

	public void setRoomName(String roomName) {
		this.roomName = roomName;
	}

	public String getRoomDetailId() {
		return roomDetailId;
	}

	public void setRoomDetailId(String roomDetailId) {
		this.roomDetailId = roomDetailId;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public int getDay() {
		return day;
	}

	public void setDay(int day) {
		this.day = day;
	}

	public BigDecimal getTotalBill() {
		return totalBill;
	}

	public void setTotalBill(BigDecimal totalBill) {
		this.totalBill = totalBill;
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
