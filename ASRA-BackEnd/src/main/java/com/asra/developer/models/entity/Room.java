package com.asra.developer.models.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "room")
public class Room extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@Column(length = 70)
	private String title;

	private int capacity;

	@Column(length = 1)
	private String roomGenderFlg;

	private BigDecimal roomArea;

	private BigDecimal rentalPrice;

	private BigDecimal deposit;

	private BigDecimal electricityCost;

	private BigDecimal waterCost;

	private BigDecimal internetCost;

	@Column(length = 30)
	private String lat;

	@Column(length = 30)
	private String lng;

	private boolean status;

	@Column(length = 1000)
	private String thubnailImage;

	@Column(length = 500)
	private String thumbnailImageName;

	@Column(length = 10000)
	private String description;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "room_utility", joinColumns = @JoinColumn(name = "room_id"), inverseJoinColumns = @JoinColumn(name = "utility_id"))
	private Set<UtilityMaster> utilities = new HashSet<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_address_id")
	private AddressMaster address;

	@ManyToOne
	@JoinColumn(name = "room_type_id")
	private RoomType roomType;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "room_image", joinColumns = @JoinColumn(name = "room_id"), inverseJoinColumns = @JoinColumn(name = "image_id"))
	private Set<ImageMaster> roomImage = new HashSet<>();

	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
	private Set<RoomDetail> roomDetails = new HashSet<>();

	@ManyToOne
	@JoinColumn(name = "account_id")
	private Account account;

	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
	private Set<Deposit> deposits = new HashSet<>();

	public Room() {

	}

	public Room(long id, Date insertDate, String title, BigDecimal roomArea, BigDecimal rentalPrice,
			BigDecimal electricityCost, BigDecimal waterCost, BigDecimal internetCost, String thubnailImage,
			AddressMaster address, RoomType roomType) {
		super(id, insertDate);
		this.title = title;
		this.roomArea = roomArea;
		this.rentalPrice = rentalPrice;
		this.electricityCost = electricityCost;
		this.waterCost = waterCost;
		this.internetCost = internetCost;
		this.thubnailImage = thubnailImage;
		this.address = address;
		this.roomType = roomType;
	}

	public Room(String title, int capacity, String roomGenderFlg, BigDecimal roomArea, BigDecimal rentalPrice,
			BigDecimal deposit, BigDecimal electricityCost, BigDecimal waterCost, BigDecimal internetCost,
			String thubnailImage, String description, Set<UtilityMaster> utilities, AddressMaster address,
			RoomType roomType, Set<ImageMaster> roomImage) {
		super();
		this.title = title;
		this.capacity = capacity;
		this.roomGenderFlg = roomGenderFlg;
		this.roomArea = roomArea;
		this.rentalPrice = rentalPrice;
		this.deposit = deposit;
		this.electricityCost = electricityCost;
		this.waterCost = waterCost;
		this.internetCost = internetCost;
		this.thubnailImage = thubnailImage;
		this.description = description;
		this.utilities = utilities;
		this.address = address;
		this.roomType = roomType;
		this.roomImage = roomImage;
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	public String getThubnailImage() {
		return thubnailImage;
	}

	public void setThubnailImage(String thubnailImage) {
		this.thubnailImage = thubnailImage;
	}

	public String getThumbnailImageName() {
		return thumbnailImageName;
	}

	public void setThumbnailImageName(String thumbnailImageName) {
		this.thumbnailImageName = thumbnailImageName;
	}

	public Set<Deposit> getDeposits() {
		return deposits;
	}

	public void setDeposits(Set<Deposit> deposits) {
		this.deposits = deposits;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<UtilityMaster> getUtilities() {
		return utilities;
	}

	public void setUtilities(Set<UtilityMaster> utilities) {
		this.utilities = utilities;
	}

	public AddressMaster getAddress() {
		return address;
	}

	public void setAddress(AddressMaster address) {
		this.address = address;
	}

	public RoomType getRoomType() {
		return roomType;
	}

	public void setRoomType(RoomType roomType) {
		this.roomType = roomType;
	}

	public Set<ImageMaster> getRoomImage() {
		return roomImage;
	}

	public void setRoomImage(Set<ImageMaster> roomImage) {
		this.roomImage = roomImage;
	}

	public int getCapacity() {
		return capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}

	public String getRoomGenderFlg() {
		return roomGenderFlg;
	}

	public void setRoomGenderFlg(String roomGenderFlg) {
		this.roomGenderFlg = roomGenderFlg;
	}

	public BigDecimal getRoomArea() {
		return roomArea;
	}

	public void setRoomArea(BigDecimal roomArea) {
		this.roomArea = roomArea;
	}

	public BigDecimal getInternetCost() {
		return internetCost;
	}

	public void setInternetCost(BigDecimal internetCost) {
		this.internetCost = internetCost;
	}

	public Set<RoomDetail> getRoomDetails() {
		return roomDetails;
	}

	public void setRoomDetails(Set<RoomDetail> roomDetails) {
		this.roomDetails = roomDetails;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "Room [title=" + title + ", capacity=" + capacity + ", roomGenderFlg=" + roomGenderFlg + ", roomArea="
				+ roomArea + ", rentalPrice=" + rentalPrice + ", deposit=" + deposit + ", electricityCost="
				+ electricityCost + ", waterCost=" + waterCost + ", internetCost=" + internetCost + ", thubnailImage="
				+ thubnailImage + ", description=" + description + ", utilities=" + utilities + ", address=" + address
				+ ", roomType=" + roomType + ", roomImage=" + roomImage + ", roomDetails=" + roomDetails + ", account="
				+ account + ", deposits=" + deposits + "]";
	}

}
