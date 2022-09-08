package com.asra.developer.models.payload.request;

public class RoomAroundRequest {

	private String currentLat;
	
	private String currentLng;
	
	private int radius;

	public String getCurrentLat() {
		return currentLat;
	}

	public void setCurrentLat(String currentLat) {
		this.currentLat = currentLat;
	}

	public String getCurrentLng() {
		return currentLng;
	}

	public void setCurrentLng(String currentLng) {
		this.currentLng = currentLng;
	}

	public int getRadius() {
		return radius;
	}

	public void setRadius(int radius) {
		this.radius = radius;
	}
	
	
}
