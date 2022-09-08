package com.asra.developer.models.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "datalog")
public class DataLog extends BaseEntity {

	private static final long serialVersionUID = 1L;

	private Long roomId;

	private Long accountId;

	@Column(length = 20)
	private String type;
	
	@Column(length = 20)
	private String masterType;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "datalog_utility", joinColumns = @JoinColumn(name = "datalog_id"), inverseJoinColumns = @JoinColumn(name = "utility_id"))
	private Set<UtilityMaster> utilities = new HashSet<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_address_id")
	private AddressMaster address;

	public DataLog() {

	}

	public DataLog(Long roomId, Long accountId, String type) {
		super();
		this.roomId = roomId;
		this.accountId = accountId;
		this.type = type;
	}

	public DataLog(Long accountId, Set<UtilityMaster> utilities, AddressMaster address, String type) {
		super();
		this.accountId = accountId;
		this.type = type;
		this.utilities = utilities;
		this.address = address;
	}

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public Long getAccountId() {
		return accountId;
	}

	public void setAccountId(Long accountId) {
		this.accountId = accountId;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
