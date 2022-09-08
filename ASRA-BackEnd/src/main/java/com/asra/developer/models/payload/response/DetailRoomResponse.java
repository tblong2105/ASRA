package com.asra.developer.models.payload.response;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class DetailRoomResponse {

	private String title;

	private int capacity;

	private int totalRoom;

	private int totalRoomEmpty;

	private BigDecimal roomArea;

	private BigDecimal rentalPrice;

	private BigDecimal deposit;

	private BigDecimal electricityCost;

	private BigDecimal waterCost;

	private BigDecimal internetCost;

	private String description;

	private Date createDate;
	
	private List<ImageResponse> imageList = new ArrayList<>();
	
	private String roomGenderFlg;

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

	private String city;

	private String district;

	private String ward;

	private String streetName;

	private String roomTypeId;
	
	private String roomType;

	private Date createRoomDate;

	private String innkeeperEmail;

	private String innkeeperFullName;

	private String innkeeperImage;

	private String innkeeperPhoneNumber;
	
	private String innkeeperAddress;

	private long innkeeperId;

	private String innkeeperUserName;
	
	private Integer depositRequestCount;

	private Integer paymentStatusWaitingCreateCount;

	private List<DataRoomDetail> roomDetailDropdown;

	private List<RentedRoomDetailResponse> roomDetailRentedList;

	private ImageResponse thumbnail;

	public DetailRoomResponse() {

	}
	
	

	public Date getCreateDate() {
		return createDate;
	}



	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}



	public Integer getPaymentStatusWaitingCreateCount() {
		return paymentStatusWaitingCreateCount;
	}

	public void setPaymentStatusWaitingCreateCount(Integer paymentStatusWaitingCreateCount) {
		this.paymentStatusWaitingCreateCount = paymentStatusWaitingCreateCount;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getCapacity() {
		return capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}

	public int getTotalRoom() {
		return totalRoom;
	}

	public void setTotalRoom(int totalRoom) {
		this.totalRoom = totalRoom;
	}

	public int getTotalRoomEmpty() {
		return totalRoomEmpty;
	}

	public void setTotalRoomEmpty(int totalRoomEmpty) {
		this.totalRoomEmpty = totalRoomEmpty;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<ImageResponse> getImageList() {
		return imageList;
	}

	public void setImageList(List<ImageResponse> imageList) {
		this.imageList = imageList;
	}
	
	public String getRoomGenderFlg() {
		return roomGenderFlg;
	}

	public void setRoomGenderFlg(String roomGenderFlg) {
		this.roomGenderFlg = roomGenderFlg;
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

	public String getRoomTypeId() {
		return roomTypeId;
	}

	public void setRoomTypeId(String roomTypeId) {
		this.roomTypeId = roomTypeId;
	}

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

	public Date getCreateRoomDate() {
		return createRoomDate;
	}

	public void setCreateRoomDate(Date createRoomDate) {
		this.createRoomDate = createRoomDate;
	}

	public String getInnkeeperEmail() {
		return innkeeperEmail;
	}

	public void setInnkeeperEmail(String innkeeperEmail) {
		this.innkeeperEmail = innkeeperEmail;
	}

	public String getInnkeeperFullName() {
		return innkeeperFullName;
	}

	public void setInnkeeperFullName(String innkeeperFullName) {
		this.innkeeperFullName = innkeeperFullName;
	}

	public String getInnkeeperImage() {
		return innkeeperImage;
	}

	public void setInnkeeperImage(String innkeeperImage) {
		this.innkeeperImage = innkeeperImage;
	}

	public String getInnkeeperPhoneNumber() {
		return innkeeperPhoneNumber;
	}

	public void setInnkeeperPhoneNumber(String innkeeperPhoneNumber) {
		this.innkeeperPhoneNumber = innkeeperPhoneNumber;
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

	public boolean isUtilities_television() {
		return utilities_television;
	}

	public void setUtilities_television(boolean utilities_television) {
		this.utilities_television = utilities_television;
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

	public long getInnkeeperId() {
		return innkeeperId;
	}

	public String getInnkeeperUserName() {
		return innkeeperUserName;
	}

	public void setInnkeeperUserName(String innkeeperUserName) {
		this.innkeeperUserName = innkeeperUserName;
	}

	public void setInnkeeperId(long innkeeperId) {
		this.innkeeperId = innkeeperId;
	}

	public Integer getDepositRequestCount() {
		return depositRequestCount;
	}

	public void setDepositRequestCount(Integer depositRequestCount) {
		this.depositRequestCount = depositRequestCount;
	}

	public List<DataRoomDetail> getRoomDetailDropdown() {
		return roomDetailDropdown;
	}

	public void setRoomDetailDropdown(List<DataRoomDetail> roomDetailDropdown) {
		this.roomDetailDropdown = roomDetailDropdown;
	}

	public List<RentedRoomDetailResponse> getRoomDetailRentedList() {
		return roomDetailRentedList;
	}

	public void setRoomDetailRentedList(List<RentedRoomDetailResponse> roomDetailRentedList) {
		this.roomDetailRentedList = roomDetailRentedList;
	}

	public ImageResponse getThumbnail() {
		return thumbnail;
	}

	public void setThumbnail(ImageResponse thumbnail) {
		this.thumbnail = thumbnail;
	}

	public String getInnkeeperAddress() {
		return innkeeperAddress;
	}

	public void setInnkeeperAddress(String innkeeperAddress) {
		this.innkeeperAddress = innkeeperAddress;
	}
	
	

}
