package com.asra.developer.controllers;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.models.payload.request.EditRoomDetailRequest;
import com.asra.developer.models.payload.response.DetailRoomWithContractResponse;
import com.asra.developer.models.payload.response.EditRoomDetailResponse;
import com.asra.developer.models.payload.response.RoomDetailNameResponse;
import com.asra.developer.services.RoomDetailServices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/room-detail")
public class RoomDetailController {

	@Autowired
	private RoomDetailServices roomDetailServices;

	@GetMapping("/room-detail-name/{id}")
	public ResponseEntity<List<RoomDetailNameResponse>> getRoomDetailByRoomId(@PathVariable("id") String id) {

		List<RoomDetailNameResponse> roomDetailNameList = roomDetailServices.getRoomDetailByRoomId(id);

		return new ResponseEntity<>(roomDetailNameList, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/edit")
	public ResponseEntity<EditRoomDetailResponse> editRoomDetail(
			@RequestBody EditRoomDetailRequest editRoomDetailRequest) {

		EditRoomDetailResponse editRoomDetailResponse = roomDetailServices.editRoomDetail(editRoomDetailRequest);

		return new ResponseEntity<>(editRoomDetailResponse, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<DetailRoomWithContractResponse> getRoomDetailWithContractChanged(
			@PathVariable("id") Long roomDetailId) {

		DetailRoomWithContractResponse detailRoomWithContractResponse = roomDetailServices.getRoomDetail(roomDetailId);

		return new ResponseEntity<>(detailRoomWithContractResponse, HttpStatus.OK);

	}

}
