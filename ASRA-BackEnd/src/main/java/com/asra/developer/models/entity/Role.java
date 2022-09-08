package com.asra.developer.models.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import com.asra.developer.common.base.BaseEntity;
import com.asra.developer.common.enums.ERole;

@Entity
public class Role extends BaseEntity {
	private static final long serialVersionUID = 1L;

	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private ERole name;

	public Role() {

	}

	public Role(ERole name) {
		super();
		this.name = name;
	}

	public ERole getName() {
		return name;
	}

	public void setName(ERole name) {
		this.name = name;
	}

}
