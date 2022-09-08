package com.asra.developer.models.payload.request;

import java.math.BigDecimal;
import java.util.List;

public class CreateRoomRequest {

	private String roomType;

	private List<String> roomsName;

	private int capacity;

	private String gender;

	private BigDecimal roomArea;

	private BigDecimal rentalPrice;

	private BigDecimal deposit;

	private BigDecimal electricityCost;

	private BigDecimal waterCost;

	private BigDecimal internetCost;

	private String city;

	private String district;

	private String ward;

	private String streetName;

	private List<ImageRequest> imageList;

	private List<String> utilities;

	private String title;

	private String description;
	
	private String lat;
	
	private String lng;

	public CreateRoomRequest() {

	}

	public CreateRoomRequest(String roomType, List<String> roomsName, int capacity, String gender, BigDecimal roomArea,
			BigDecimal rentalPrice, BigDecimal deposit, BigDecimal electricityCost, BigDecimal waterCost,
			BigDecimal internetCost, String city, String district, String ward, String streetName,
			List<ImageRequest> imageList, List<String> utilities, String title, String description) {
		super();
		this.roomType = roomType;
		this.roomsName = roomsName;
		this.capacity = capacity;
		this.gender = gender;
		this.roomArea = roomArea;
		this.rentalPrice = rentalPrice;
		this.deposit = deposit;
		this.electricityCost = electricityCost;
		this.waterCost = waterCost;
		this.internetCost = internetCost;
		this.city = city;
		this.district = district;
		this.ward = ward;
		this.streetName = streetName;
		this.imageList = imageList;
		this.utilities = utilities;
		this.title = title;
		this.description = description;
	}
	
	

	public String getLat() {
		return lat;
	}

	public void setLat(String lat) {
		this.lat = lat;
	}

	public String getLng() {
		return lng;
	}

	public void setLng(String lng) {
		this.lng = lng;
	}

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

	public List<String> getRoomsName() {
		return roomsName;
	}

	public void setRoomsName(List<String> roomsName) {
		this.roomsName = roomsName;
	}

	public int getCapacity() {
		return capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
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

	public BigDecimal getDeposit() {
		return deposit;
	}

	public void setDeposit(BigDecimal deposit) {
		this.deposit = deposit;
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

	public BigDecimal getInternetCost() {
		return internetCost;
	}

	public void setInternetCost(BigDecimal internetCost) {
		this.internetCost = internetCost;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public String getWard() {
		return ward;
	}

	public void setWard(String ward) {
		this.ward = ward;
	}

	public String getStreetName() {
		return streetName;
	}

	public void setStreetName(String streetName) {
		this.streetName = streetName;
	}

	public List<ImageRequest> getImageList() {
		return imageList;
	}

	public void setImageList(List<ImageRequest> imageList) {
		this.imageList = imageList;
	}

	public List<String> getUtilities() {
		return utilities;
	}

	public void setUtilities(List<String> utilities) {
		this.utilities = utilities;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
