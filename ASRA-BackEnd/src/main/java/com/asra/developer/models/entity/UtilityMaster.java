package com.asra.developer.models.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "utility_master")
public class UtilityMaster implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(length = 3)
	private String roomUtilityId;

	@Column(length = 100)
	private String roomUtilityName;

	public UtilityMaster() {

	}

	public UtilityMaster(String roomUtilityId) {
		super();
		this.roomUtilityId = roomUtilityId;
	}

	public UtilityMaster(String roomUtilityId, String roomUtilityName) {
		super();
		this.roomUtilityId = roomUtilityId;
		this.roomUtilityName = roomUtilityName;
	}

	public String getRoomUtilityId() {
		return roomUtilityId;
	}

	public void setRoomUtilityId(String roomUtilityId) {
		this.roomUtilityId = roomUtilityId;
	}

	public String getRoomUtilityName() {
		return roomUtilityName;
	}

	public void setRoomUtilityName(String roomUtilityName) {
		this.roomUtilityName = roomUtilityName;
	}

	@Override
	public String toString() {
		return "UtilityMaster [roomUtilityId=" + roomUtilityId + ", roomUtilityName=" + roomUtilityName + "]";
	}

}
