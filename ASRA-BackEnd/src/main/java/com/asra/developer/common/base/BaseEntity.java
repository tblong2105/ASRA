package com.asra.developer.common.base;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@MappedSuperclass
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class BaseEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "Id")
	private long id;

	@Column(name = "create_date", nullable = false)
	private Date insertDate;

	@Column(name = "update_date", nullable = false)
	private Date updateDate;

	@Column(name = "create_user", length = 50)
	private String createUser;

	@Column(name = "update_user", length = 50)
	private String updateUser;

	public BaseEntity() {

	}

	public BaseEntity(long id) {
		this.id = id;
	}
	
	public BaseEntity(long id, Date insertDate) {
		this.id = id;
		this.insertDate = insertDate;
	}

	@PrePersist
	protected void prePersist() {
		if (this.insertDate == null)
			this.insertDate = new Date();
		if (this.updateDate == null)
			this.updateDate = new Date();

		if (this.createUser == null) {
			this.createUser = getUserName();
		}

		if (this.updateUser == null) {
			this.updateUser = getUserName();
		}
	}

	@PreUpdate
	protected void preUpdate() {

		this.updateDate = new Date();

		this.updateUser = getUserName();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Date getInsertDate() {
		return insertDate;
	}

	protected void setInsertDate(Date insertDate) {
		this.insertDate = insertDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	protected void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getCreateUser() {
		return createUser;
	}

	protected void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	protected void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	private String getUserName() {
		String userName = "SYSTEM";
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {

			Object principal = authentication.getPrincipal();

			if (principal != null && principal instanceof UserDetails) {
				userName = ((UserDetails) authentication.getPrincipal()).getUsername();
			}
		}
		return userName;
	}

}
