package com.asra.developer.models.payload.request;

import java.math.BigDecimal;

public class SearchRoomRequest {

	private String city;

	private String[] district;

	private String ward;

	private String streetName;

	private BigDecimal minPrice;
	private BigDecimal maxPrice;
	private boolean utilities_bed;
	private boolean utilities_wm;
	private boolean utilities_time;
	private boolean utilities_ac;
	private boolean utilities_refrigerator;
	private boolean utilities_wifi;
	private boolean utilities_parking;
	private boolean utilities_toilet;
	private boolean utilities_kitchen;
	private boolean utilities_television;
	private boolean dormitory;
	private boolean roomForRent;
	private boolean apartment;
	private boolean wholeHouse;
	private boolean sharedRoom;

	private int roomAreaMin;

	private int roomAreaMax;

	private String lat;

	private String lng;

	private String radius;

	private String sortBy;

	private int page;

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String[] getDistrict() {
		return district != null ? district.clone() : null;
	}

	public void setDistrict(String[] district) {
		this.district = district != null ? district.clone() : null;
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

	public BigDecimal getMinPrice() {
		return minPrice;
	}

	public void setMinPrice(BigDecimal minPrice) {
		this.minPrice = minPrice;
	}

	public BigDecimal getMaxPrice() {
		return maxPrice;
	}

	public void setMaxPrice(BigDecimal maxPrice) {
		this.maxPrice = maxPrice;
	}

	public boolean isUtilities_bed() {
		return utilities_bed;
	}

	public void setUtilities_bed(boolean utilities_bed) {
		this.utilities_bed = utilities_bed;
	}

	public boolean isUtilities_wm() {
		return utilities_wm;
	}

	public void setUtilities_wm(boolean utilities_wm) {
		this.utilities_wm = utilities_wm;
	}

	public boolean isUtilities_time() {
		return utilities_time;
	}

	public void setUtilities_time(boolean utilities_time) {
		this.utilities_time = utilities_time;
	}

	public boolean isUtilities_ac() {
		return utilities_ac;
	}

	public void setUtilities_ac(boolean utilities_ac) {
		this.utilities_ac = utilities_ac;
	}

	public boolean isUtilities_refrigerator() {
		return utilities_refrigerator;
	}

	public void setUtilities_refrigerator(boolean utilities_refrigerator) {
		this.utilities_refrigerator = utilities_refrigerator;
	}

	public boolean isUtilities_wifi() {
		return utilities_wifi;
	}

	public void setUtilities_wifi(boolean utilities_wifi) {
		this.utilities_wifi = utilities_wifi;
	}

	public boolean isUtilities_parking() {
		return utilities_parking;
	}

	public void setUtilities_parking(boolean utilities_parking) {
		this.utilities_parking = utilities_parking;
	}

	public boolean isUtilities_toilet() {
		return utilities_toilet;
	}

	public void setUtilities_toilet(boolean utilities_toilet) {
		this.utilities_toilet = utilities_toilet;
	}

	public boolean isUtilities_kitchen() {
		return utilities_kitchen;
	}

	public void setUtilities_kitchen(boolean utilities_kitchen) {
		this.utilities_kitchen = utilities_kitchen;
	}

	public boolean isUtilities_television() {
		return utilities_television;
	}

	public void setUtilities_television(boolean utilities_television) {
		this.utilities_television = utilities_television;
	}

	public boolean isDormitory() {
		return dormitory;
	}

	public void setDormitory(boolean dormitory) {
		this.dormitory = dormitory;
	}

	public boolean isRoomForRent() {
		return roomForRent;
	}

	public void setRoomForRent(boolean roomForRent) {
		this.roomForRent = roomForRent;
	}

	public boolean isApartment() {
		return apartment;
	}

	public void setApartment(boolean apartment) {
		this.apartment = apartment;
	}

	public boolean isWholeHouse() {
		return wholeHouse;
	}

	public void setWholeHouse(boolean wholeHouse) {
		this.wholeHouse = wholeHouse;
	}

	public boolean isSharedRoom() {
		return sharedRoom;
	}

	public void setSharedRoom(boolean sharedRoom) {
		this.sharedRoom = sharedRoom;
	}

	public int getRoomAreaMin() {
		return roomAreaMin;
	}

	public void setRoomAreaMin(int roomAreaMin) {
		this.roomAreaMin = roomAreaMin;
	}

	public int getRoomAreaMax() {
		return roomAreaMax;
	}

	public void setRoomAreaMax(int roomAreaMax) {
		this.roomAreaMax = roomAreaMax;
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

	public String getRadius() {
		return radius;
	}

	public void setRadius(String radius) {
		this.radius = radius;
	}

	public String getSortBy() {
		return sortBy;
	}

	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

}
