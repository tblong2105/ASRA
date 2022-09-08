package com.asra.developer.models.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "room_detail")
public class RoomDetail extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@Column(length = 50)
	private String roomNo;

	private boolean roomStatus;

	@ManyToOne
	@JoinColumn(name = "room_id")
	private Room room;

	@OneToMany(mappedBy = "roomDetail", cascade = CascadeType.ALL)
	private Set<Contract> contracts = new HashSet<>();

	public RoomDetail() {

	}

	public RoomDetail(String roomNo) {
		super();
		this.roomNo = roomNo;
	}

	public String getRoomNo() {
		return roomNo;
	}

	public void setRoomNo(String roomNo) {
		this.roomNo = roomNo;
	}

	public boolean isRoomStatus() {
		return roomStatus;
	}

	public void setRoomStatus(boolean roomStatus) {
		this.roomStatus = roomStatus;
	}

	public Room getRoom() {
		return room;
	}

	public void setRoom(Room room) {
		this.room = room;
	}

	public Set<Contract> getContracts() {
		return contracts;
	}

	public void setContracts(Set<Contract> contracts) {
		this.contracts = contracts;
	}

}
