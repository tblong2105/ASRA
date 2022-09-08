package com.asra.developer.models.payload.request;

public class ImageRequest {

	private String imageLink;

	private String imageName;

	public ImageRequest() {

	}

	public ImageRequest(String imageLink, String imageName) {
		super();
		this.imageLink = imageLink;
		this.imageName = imageName;
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
