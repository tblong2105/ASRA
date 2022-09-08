package com.asra.developer.models.payload.response;

public class ImageResponse {

	private long id;

	private String imageLink;

	private String imageName;

	public ImageResponse(long id, String imageLink, String imageName) {
		super();
		this.id = id;
		this.imageLink = imageLink;
		this.imageName = imageName;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getImageLink() {
		return imageLink;
	}

	public void setImageLink(String imageLink) {
		this.imageLink = imageLink;
	}

	public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

}
