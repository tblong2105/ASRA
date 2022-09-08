package com.asra.developer.models.entity;

import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "address_master")
public class AddressMaster extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@Column(length = 50)
	private String city;

	@Column(length = 50)
	private String district;

	@Column(length = 50)
	private String ward;

	@Column(length = 200)
	private String streetName;

	private String type;

	@OneToMany(mappedBy = "address", cascade = CascadeType.ALL)
	private Collection<Room> rooms;

	@OneToMany(mappedBy = "address", cascade = CascadeType.ALL)
	private Collection<Account> account;

	public AddressMaster() {

	}

	public AddressMaster(String city, String district, String ward, String streetName) {
		super();
		this.city = city;
		this.district = district;
		this.ward = ward;
		this.streetName = streetName;
	}

	public AddressMaster(String city, String district, String ward, String streetName, String type) {
		super();
		this.city = city;
		this.district = district;
		this.ward = ward;
		this.streetName = streetName;
		this.type = type;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
