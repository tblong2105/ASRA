package com.asra.developer.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.common.error.MessageModel;
import com.asra.developer.models.entity.Contract;
import com.asra.developer.models.entity.RoomDetail;
import com.asra.developer.models.payload.request.EditRoomDetailRequest;
import com.asra.developer.models.payload.response.DetailRoomWithContractResponse;
import com.asra.developer.models.payload.response.EditRoomDetailResponse;
import com.asra.developer.models.payload.response.RoomDetailNameResponse;
import com.asra.developer.repository.RoomDetailRepository;

@Service
public class RoomDetailServices {

	@Autowired
	private RoomDetailRepository roomDetailRepository;

	public List<RoomDetailNameResponse> getRoomDetailByRoomId(String id) {
		long roomId = 0L;
		try {
			roomId = Long.parseLong(id);

		} catch (NumberFormatException e) {
			throw new BussinessExeption(MessageConstants.MSE001);
		}

		List<RoomDetail> roomDetailList = roomDetailRepository.getByRoomId(roomId);
		List<RoomDetailNameResponse> roomDetailNameList = new ArrayList<RoomDetailNameResponse>();
		for (RoomDetail roomDetail : roomDetailList) {
			RoomDetailNameResponse detailNameResponse = new RoomDetailNameResponse(roomDetail.getId(),
					roomDetail.getRoomNo());
			roomDetailNameList.add(detailNameResponse);
		}
		return roomDetailNameList;
	}

	public RoomDetail getRoomDetailById(Long roomId) {
		return roomDetailRepository.findById(roomId).get();
	}

	public EditRoomDetailResponse editRoomDetail(EditRoomDetailRequest editRoomDetailRequest) {

		EditRoomDetailResponse editRoomDetailResponse = new EditRoomDetailResponse();
		Optional<RoomDetail> roomDetailOp = roomDetailRepository.findById(editRoomDetailRequest.getRoomDetailId());

		if (roomDetailOp.isPresent()) {
			RoomDetail roomDetail = roomDetailOp.get();
			roomDetail.setRoomNo(editRoomDetailRequest.getRoomNo());

			roomDetailRepository.save(roomDetail);

			editRoomDetailResponse.setMessage(new MessageModel(MessageConstants.MSI021));
		}

		return editRoomDetailResponse;
	}

	public void setStatusRoomDetailRented(Long roomDetailId) {
		roomDetailRepository.setStatusRoomDetailRented(roomDetailId);
	}

	public DetailRoomWithContractResponse getRoomDetail(Long roomDetailId) {

		DetailRoomWithContractResponse detailRoomResponse = new DetailRoomWithContractResponse();

		Optional<RoomDetail> roomDetailOp = roomDetailRepository.findById(roomDetailId);

		if (roomDetailOp.isPresent()) {

			RoomDetail roomDetail = roomDetailOp.get();

			for (Contract c : roomDetail.getContracts()) {

				detailRoomResponse.setRentalPrice(c.getRentalPrice());
				detailRoomResponse.setElectronicPrice(c.getElectronicPrice());
				detailRoomResponse.setWaterPrice(c.getWaterPrice());
				detailRoomResponse.setInternetPrice(c.getInternetPrice());
				detailRoomResponse.setId(c.getId());
				detailRoomResponse.setStartDate(c.getStartDate());
				detailRoomResponse.setEndDate(c.getEndDate());
			}

		}

		return detailRoomResponse;
	}
}
