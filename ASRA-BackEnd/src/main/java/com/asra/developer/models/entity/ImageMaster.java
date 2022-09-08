package com.asra.developer.models.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.asra.developer.common.base.BaseEntity;

@Entity
@Table(name = "image_master")
public class ImageMaster extends BaseEntity {

	private static final long serialVersionUID = 1L;

	@Column(length = 1000)
	private String imageUrl;

	@Column(length = 500)
	private String imageName;

	public ImageMaster() {

	}

	public ImageMaster(String imageUrl, String imageName) {
		super();
		this.imageUrl = imageUrl;
		this.imageName = imageName;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

}
