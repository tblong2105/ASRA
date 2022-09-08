package com.asra.developer.controllers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.common.constants.DepositConstant;
import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.Deposit;
import com.asra.developer.models.entity.Payment;
import com.asra.developer.models.entity.Room;
import com.asra.developer.models.payload.request.DepositRequest;
import com.asra.developer.models.payload.response.DepositResponse;
import com.asra.developer.models.payload.response.GetAllDepositRequest;
import com.asra.developer.models.payload.response.GetAllDepositResponse;
import com.asra.developer.models.payload.response.MessageResponse;
import com.asra.developer.models.payload.response.vo.DepositResponseVO;
import com.asra.developer.models.payload.response.vo.GetAllDepositVO;
import com.asra.developer.repository.DepositRepository;
import com.asra.developer.repository.PaymentRepository;
import com.asra.developer.repository.RoomRepository;
import com.asra.developer.services.AccountServices;
import com.asra.developer.services.DepositServices;
import com.asra.developer.services.PayPalServices;
import com.paypal.base.rest.PayPalRESTException;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/deposit")
public class DepositController {

	@Autowired
	private DepositRepository depositRepository;

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private AccountServices accountServices;

	@Autowired
	private DepositServices depositServices;

	@Autowired
	private PayPalServices payPalServices;

	@Autowired
	private PaymentRepository paymentRepository;

	@GetMapping("/check-exist/{roomId}")
	public boolean checkDepositExist(@PathVariable("roomId") Long roomId) {
		// Check deposit exist.
		Optional<Deposit> depositOptional = depositRepository
				.findByAccountIdAndRoomId(accountServices.getCurrentAccountId(), roomId);

		if (depositOptional.isPresent()) {
			if (!(depositOptional.get().getStatus().equals(DepositConstant.CANCEL)
					|| depositOptional.get().getStatus().equals(DepositConstant.REFUND))) {
				throw new BussinessExeption(MessageConstants.MSE023);
			}
		}
		return false;
	}

	@Transactional
	@GetMapping("/cancel-deposit/{depositId}")
	public ResponseEntity<?> cancelDeposit(@PathVariable("depositId") Long depositId) {
		Deposit currentDeposit = depositRepository.findById(depositId).get();
		if (!DepositConstant.PENDING_APPROVAL.equals(currentDeposit.getStatus())) {
			throw new BussinessExeption(MessageConstants.MSE038);
		}

		Payment refund = currentDeposit.getPayment();
		StringBuilder sb = new StringBuilder();
		sb.append("Refund room deposit # ");
		sb.append(currentDeposit.getRoom().getId());
		try {
			if (refund != null) {
				payPalServices.createPaymentRefund(refund.getPayerEmailAddress(), refund.getPaymentAmount(),
						sb.toString());
			}
		} catch (PayPalRESTException e1) {
			e1.printStackTrace();
			throw new BussinessExeption(MessageConstants.MSE039);
		}
		currentDeposit.setStatus(DepositConstant.CANCEL);
		depositRepository.save(currentDeposit);

		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI025));
	}

	@Transactional
	@GetMapping("/refund-deposit/{depositId}")
	public ResponseEntity<?> refundDeposit(@PathVariable("depositId") Long depositId) {
		Deposit currentDeposit = depositRepository.findById(depositId).get();

		if (!DepositConstant.PENDING_APPROVAL.equals(currentDeposit.getStatus())) {
			throw new BussinessExeption(MessageConstants.MSE038);
		}

		Payment refund = currentDeposit.getPayment();
		StringBuilder sb = new StringBuilder();
		sb.append("Refund room deposit # ");
		sb.append(currentDeposit.getRoom().getId());
		try {
			if (refund != null) {
				payPalServices.createPaymentRefund(refund.getPayerEmailAddress(), refund.getPaymentAmount(),
						sb.toString());
			}
		} catch (PayPalRESTException e1) {
			e1.printStackTrace();
			throw new BussinessExeption(MessageConstants.MSE039);
		}
		currentDeposit.setStatus(DepositConstant.REFUND);
		depositRepository.save(currentDeposit);

		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI027));
	}

	@Transactional
	@PostMapping("/new")
	public ResponseEntity<?> createDeposit(@Valid @RequestBody DepositRequest inputRequest) {

		Deposit deposit = new Deposit();

		Long roomId = Long.parseLong(inputRequest.getRoomId());

		Room room = roomRepository.getById(roomId);

		deposit.setAccount(accountServices.getCurrentAccountSon(inputRequest.getUsername()));

		deposit.setRoom(room);

		deposit.setDepositCost(inputRequest.getDepositCost());

		deposit.setStatus(DepositConstant.PENDING_APPROVAL);

		if (inputRequest.getDepositCost() != BigDecimal.ZERO) {
			deposit.setPayment(paymentRepository.findById(inputRequest.getPaymentId()).get());
		}

		depositRepository.save(deposit);

		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI013));
	}

	@PostMapping("/")
	public ResponseEntity<?> getDepositListByStatus(@RequestBody GetAllDepositRequest request) {
		Page<Deposit> listDeposit = depositServices.getAllDeposit(request);

		DepositResponse depositResponse = new DepositResponse();
		List<DepositResponseVO> depositResponseVOList = new ArrayList<>();

		for (Deposit d : listDeposit.getContent()) {

			DepositResponseVO depositResponseVO = new DepositResponseVO();

			depositResponseVO.setId(d.getId());

			depositResponseVO.setDepositCost(d.getDepositCost());

			depositResponseVO.setStatus(d.getStatus());

			depositResponseVO.setFullName(d.getAccount().getFullName());

			depositResponseVO.setUsername(d.getAccount().getUserName());

			depositResponseVO.setEmail(d.getAccount().getEmail());

			depositResponseVO.setAge(d.getAccount().getAge());

			depositResponseVO.setGender(d.getAccount().getGender());

			depositResponseVO.setPhoneNumber(d.getAccount().getPhoneNumber());

			depositResponseVO.setProfession(d.getAccount().getProfession());

			depositResponseVO.setDateRequest(d.getInsertDate());

			depositResponseVO.setAccountId(d.getAccount().getId());

			depositResponseVOList.add(depositResponseVO);
		}

		depositResponse.setDeposits(depositResponseVOList);

		depositResponse.setCurrentPage(listDeposit.getNumber() + 1);

		depositResponse.setTotalItems((int) listDeposit.getTotalElements());

		depositResponse.setTotalPages(listDeposit.getTotalPages());

		return new ResponseEntity<>(depositResponse, HttpStatus.OK);

	}

	@GetMapping("/all")
	public ResponseEntity<?> getAllDeposited(@RequestParam("page") int page) {

		GetAllDepositResponse response = new GetAllDepositResponse();

		Account acc = accountServices.getCurrentAccount();

		Pageable paging = PageRequest.of(page - 1, SystemConstants.MAX_RESULT);

		Page<Deposit> deposits = depositRepository.findByAccountId(acc.getId(), paging);

		List<GetAllDepositVO> depositVOs = new ArrayList<GetAllDepositVO>();

		for (Deposit deposit : deposits.getContent()) {
			GetAllDepositVO depositVO = new GetAllDepositVO();
			depositVO.setId(deposit.getId());

			depositVO.setRoomId(deposit.getRoom().getId());

			depositVO.setThubnailImage(deposit.getRoom().getThubnailImage());

			depositVO.setAddress(StringUtil.getAddressFromDB(deposit.getRoom().getAddress()));

			depositVO.setDepositCost(deposit.getDepositCost());

			depositVO.setInnkeeperName(deposit.getRoom().getAccount().getFullName());

			depositVO.setInnkeeperPhone(deposit.getRoom().getAccount().getPhoneNumber());

			depositVO.setCreatedDate(deposit.getInsertDate());

			depositVO.setStatus(deposit.getStatus());

			depositVOs.add(depositVO);
		}
		response.setDeposits(depositVOs);

		response.setCurrentPage(deposits.getNumber() + 1);

		response.setTotalItems((int) deposits.getTotalElements());

		response.setTotalPages(deposits.getTotalPages());

		return new ResponseEntity<>(response, HttpStatus.OK);

	}
}
