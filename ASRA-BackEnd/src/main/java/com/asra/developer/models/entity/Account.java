package com.asra.developer.models.entity;

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
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.ColumnDefault;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "account", uniqueConstraints = { @UniqueConstraint(columnNames = "userName") })
public class Account extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@Column(length = 50)
	private String userName;

	@Column(length = 1000)
	private String password;

	@Column(length = 50)
	private String email;

	@Column(length = 50)
	private String fullName;

	@ColumnDefault("0")
	private int age;

	@Column(length = 1)
	private String gender;

	@Column(length = 50)
	private String profession;

	@Column(length = 15)
	private String phoneNumber;

	@Column(length = 50)
	private String gmailPaypal;

	@Column(length = 1000)
	private String image;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles = new HashSet<>();

	@OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
	private Set<Room> rooms = new HashSet<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "address_id")
	private AddressMaster address;

	@OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
	private Set<Deposit> deposits = new HashSet<>();

	@OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
	private Set<Innkeeper> innkeeper = new HashSet<>();

	@OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
	private Set<Contract> contracts = new HashSet<>();

	@OneToMany(mappedBy = "billPayee", cascade = CascadeType.ALL)
	private Set<Bill> billPayees = new HashSet<>();

	@OneToMany(mappedBy = "billPayer", cascade = CascadeType.ALL)
	private Set<Bill> billPayers = new HashSet<>();

	@OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
	private Set<TokenPassword> tokenPassword = new HashSet<>();

	public Account() {

	}

	public Account(String userName, String password) {
		this.userName = userName;
		this.password = password;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getProfession() {
		return profession;
	}

	public void setProfession(String profession) {
		this.profession = profession;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public Set<Room> getRooms() {
		return rooms;
	}

	public void setRooms(Set<Room> rooms) {
		this.rooms = rooms;
	}

	public AddressMaster getAddress() {
		return address;
	}

	public void setAddress(AddressMaster address) {
		this.address = address;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Set<Deposit> getDeposits() {
		return deposits;
	}

	public void setDeposits(Set<Deposit> deposits) {
		this.deposits = deposits;
	}

	public Set<Innkeeper> getInnkeeper() {
		return innkeeper;
	}

	public void setInnkeeper(Set<Innkeeper> innkeeper) {
		this.innkeeper = innkeeper;
	}

	public String getGmailPaypal() {
		return gmailPaypal;
	}

	public void setGmailPaypal(String gmailPaypal) {
		this.gmailPaypal = gmailPaypal;
	}

	public Set<TokenPassword> getTokenPassword() {
		return tokenPassword;
	}

	public void setTokenPassword(Set<TokenPassword> tokenPassword) {
		this.tokenPassword = tokenPassword;
	}

}
