package com.asra.developer.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.common.utils.RoleUtils;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.Innkeeper;
import com.asra.developer.models.entity.Payment;
import com.asra.developer.models.entity.Room;
import com.asra.developer.models.payload.request.admin.GetAllBecomeInnkeeperRequest;
import com.asra.developer.models.payload.request.admin.GetAllPaymentRequest;
import com.asra.developer.models.payload.request.admin.GetAllRoomRequest;
import com.asra.developer.models.payload.request.admin.GetAllUserRequest;
import com.asra.developer.models.payload.request.admin.UpdateStatusInnkeeperRequest;
import com.asra.developer.models.payload.response.admin.GetAllBecomeInnkeeperResponse;
import com.asra.developer.models.payload.response.admin.GetAllPaymentReponse;
import com.asra.developer.models.payload.response.admin.GetAllRoomResponse;
import com.asra.developer.models.payload.response.admin.GetAllUserResponse;
import com.asra.developer.models.payload.response.admin.GetDashBoardResponse;
import com.asra.developer.models.payload.response.vo.GetAllInnkeeperVO;
import com.asra.developer.models.payload.response.vo.GetAllPaymentVO;
import com.asra.developer.models.payload.response.vo.GetAllRoomVO;
import com.asra.developer.models.payload.response.vo.GetAllUserVO;
import com.asra.developer.repository.CustomRepository;
import com.asra.developer.services.AdminServices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/admin")
public class AdminController {

	@Autowired
	private AdminServices adminServices;

	@Autowired
	private CustomRepository customRepository;

	@PostMapping("/get-all-room")
	public ResponseEntity<?> getAllRooms(@Valid @RequestBody GetAllRoomRequest request) {

		Page<Room> listRoom = adminServices.getAllRoom(request);

		GetAllRoomResponse response = new GetAllRoomResponse();

		List<GetAllRoomVO> roomVOs = new ArrayList<GetAllRoomVO>();

		for (Room room : listRoom.getContent()) {

			GetAllRoomVO roomVO = new GetAllRoomVO();

			roomVO.setId(room.getId());

			roomVO.setUserName(room.getAccount().getUserName());

			roomVO.setTitle(room.getTitle());

			roomVO.setRoomType(room.getRoomType().getRoomTypeName());

			roomVO.setCreatedDate(room.getInsertDate());

			roomVO.setRentalPrice(room.getRentalPrice());

			roomVO.setStatus(room.isStatus());

			roomVOs.add(roomVO);
		}

		response.setRooms(roomVOs);

		response.setCurrentPage(listRoom.getNumber() + 1);

		response.setTotalItems((int) listRoom.getTotalElements());

		response.setTotalPages(listRoom.getTotalPages());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/get-all-user")
	public ResponseEntity<?> getAllUsers(@Valid @RequestBody GetAllUserRequest request) {

		Page<Account> listUser = adminServices.getAllUser(request);

		GetAllUserResponse response = new GetAllUserResponse();

		List<GetAllUserVO> userVOs = new ArrayList<GetAllUserVO>();

		for (Account acc : listUser.getContent()) {

			GetAllUserVO userVO = new GetAllUserVO();

			userVO.setId(acc.getId());

			userVO.setUserName(acc.getUserName());
			userVO.setPhoneNumber(acc.getPhoneNumber());
			userVO.setEmail(acc.getEmail());
			userVO.setFullName(acc.getFullName());
			userVO.setCreatedDate(acc.getInsertDate());
			userVO.setRole(RoleUtils.getRoleHighest(acc.getRoles()));

			userVOs.add(userVO);
		}

		response.setUsers(userVOs);

		response.setCurrentPage(listUser.getNumber() + 1);

		response.setTotalItems((int) listUser.getTotalElements());

		response.setTotalPages(listUser.getTotalPages());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/get-all-innkeepers")
	public ResponseEntity<?> getAllBecomeInnkeeper(@Valid @RequestBody GetAllBecomeInnkeeperRequest request) {

		Page<Innkeeper> listInnkeeper = adminServices.getAllBecomeInnkeeper(request);

		GetAllBecomeInnkeeperResponse response = new GetAllBecomeInnkeeperResponse();
		List<GetAllInnkeeperVO> innkeeperVOs = new ArrayList<GetAllInnkeeperVO>();

		for (Innkeeper inn : listInnkeeper.getContent()) {

			GetAllInnkeeperVO innkeeperVO = new GetAllInnkeeperVO();

			innkeeperVO.setId(inn.getId());

			innkeeperVO.setUserName(inn.getAccount().getUserName());

			innkeeperVO.setFullName(inn.getAccount().getFullName());

			innkeeperVO.setIcId(inn.getIcId());

			innkeeperVO.setCreatedDate(inn.getInsertDate());

			innkeeperVO.setStatus(inn.getStatus());

			innkeeperVOs.add(innkeeperVO);
		}

		response.setInnkeepers(innkeeperVOs);

		response.setCurrentPage(listInnkeeper.getNumber() + 1);

		response.setTotalItems((int) listInnkeeper.getTotalElements());

		response.setTotalPages(listInnkeeper.getTotalPages());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/get-details-innkeeper")
	public ResponseEntity<?> getInnkeeperById(@RequestParam("id") long id) {

		Innkeeper inn = adminServices.getInnkepperById(id);

		GetAllInnkeeperVO response = new GetAllInnkeeperVO();

		response.setId(inn.getId());

		response.setUserName(inn.getAccount().getUserName());

		response.setFullName(inn.getAccount().getFullName());

		response.setFrontImage(inn.getFrontImage());

		response.setBackImage(inn.getBackImage());

		response.setIcId(inn.getIcId());

		response.setIcName(inn.getIcName());

		response.setIcBirthdate(inn.getIcBirthdate());

		response.setIcAddress(inn.getIcAddress());

		response.setIcIssueDate(inn.getIcIssueDate());

		response.setIcIssueLoc(inn.getIcIssueLoc());

		response.setGmailPaypal(inn.getGmailPaypal());

		response.setCreatedDate(inn.getInsertDate());

		response.setStatus(inn.getStatus());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/update-status-innkeeper")
	public ResponseEntity<?> updateStatusInnkeeper(@RequestBody UpdateStatusInnkeeperRequest request) {

		// Status is "OK" or "NG"
		adminServices.updateStatusInnkeeper(request.getId(), request.getStatus());

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/get-all-payments")
	public ResponseEntity<?> getAllPayments(@Valid @RequestBody GetAllPaymentRequest request) {

		Page<Payment> listPayments = adminServices.getAllPayments(request);

		GetAllPaymentReponse response = new GetAllPaymentReponse();
		List<GetAllPaymentVO> allPaymentVOs = new ArrayList<GetAllPaymentVO>();

		for (Payment pay : listPayments.getContent()) {

			GetAllPaymentVO paymentVO = new GetAllPaymentVO();

			paymentVO.setId(pay.getId());

			paymentVO.setIdPayment(pay.getIdPayment());

			paymentVO.setPayerEmailAddress(pay.getPayerEmailAddress());

			paymentVO.setVndAmount(pay.getPaymentAmount());

			paymentVO.setCreatedDate(pay.getInsertDate());

			allPaymentVOs.add(paymentVO);
		}

		response.setAllPaymentVOs(allPaymentVOs);

		response.setCurrentPage(listPayments.getNumber() + 1);

		response.setTotalItems((int) listPayments.getTotalElements());

		response.setTotalPages(listPayments.getTotalPages());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/get-dashboard")
	public ResponseEntity<?> getAdminDashboard() {

		GetDashBoardResponse response = new GetDashBoardResponse();

		response.setTotalRoom(customRepository.adminCountRoom());
		response.setTotalContract(customRepository.adminCountContract());
		response.setTotalAccount(customRepository.adminCountAccount());
		response.setMonthContract(customRepository.adminCountMonthly());
		response.setStatusContract(customRepository.adminCountStatus());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
