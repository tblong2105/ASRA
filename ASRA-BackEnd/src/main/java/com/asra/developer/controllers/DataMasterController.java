package com.asra.developer.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.models.entity.RoomType;
import com.asra.developer.models.payload.response.DataMaster;
import com.asra.developer.repository.RoomTypeRepositoty;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/master")
public class DataMasterController {

	@Autowired
	private RoomTypeRepositoty roomTypeRepositoty;

	@GetMapping("/get-room-type")
	public ResponseEntity<?> getRoomType() {
		List<RoomType> roomTypes = roomTypeRepositoty.findAll();

		List<DataMaster> dataMasters = new ArrayList<>();

		for (RoomType roomType : roomTypes) {
			dataMasters.add(new DataMaster(roomType.getRoomTypeName(), roomType.getRoomTypeId()));
		}
		return ResponseEntity.ok(dataMasters);
	}

}
