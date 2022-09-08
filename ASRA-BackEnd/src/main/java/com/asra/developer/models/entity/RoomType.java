package com.asra.developer.models.entity;

import java.io.Serializable;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "room_type")
public class RoomType implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(length = 3)
	private String roomTypeId;

	@Column(length = 100)
	private String roomTypeName;

	@OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL)
	private Collection<Room> rooms;

	public RoomType() {
		
	}

	public RoomType(String roomTypeId) {
		super();
		this.roomTypeId = roomTypeId;
	}

	public RoomType(String roomTypeId, String roomTypeName) {
		super();
		this.roomTypeId = roomTypeId;
		this.roomTypeName = roomTypeName;
	}

	public String getRoomTypeId() {
		return roomTypeId;
	}

	public void setRoomTypeId(String roomTypeId) {
		this.roomTypeId = roomTypeId;
	}

	public String getRoomTypeName() {
		return roomTypeName;
	}

	public void setRoomTypeName(String roomTypeName) {
		this.roomTypeName = roomTypeName;
	}

}
