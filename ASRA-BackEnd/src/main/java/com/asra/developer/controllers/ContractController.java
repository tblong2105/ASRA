package com.asra.developer.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

import com.asra.developer.common.constants.ContractConstant;
import com.asra.developer.models.entity.Contract;
import com.asra.developer.models.payload.request.CreateContractRequest;
import com.asra.developer.models.payload.response.DetailContractResponse;
import com.asra.developer.models.payload.response.InnkeeperContractResponse;
import com.asra.developer.models.payload.response.ListContractWaitResponse;
import com.asra.developer.models.payload.response.vo.TenantContractVO;
import com.asra.developer.services.AccountServices;
import com.asra.developer.services.ContractServices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/contract")
public class ContractController {

	@Autowired
	private ContractServices contractServices;

	@Autowired
	private AccountServices accountServices;

	@Transactional(value = TxType.REQUIRED)
	@PostMapping("/create")
	public ResponseEntity<?> createContract(@Valid @RequestBody CreateContractRequest createContractRequest) {
		return ResponseEntity.ok(contractServices.createContract(createContractRequest));
	}
	
	@Transactional
	@GetMapping("/request-terminate/{contractId}")
	public ResponseEntity<?> requestTerminateContract(@PathVariable("contractId") Long contractId) {
		return ResponseEntity.ok(contractServices.requestTerminateContract(contractId));
	}
	
	
	@Transactional
	@GetMapping("/terminate/{contractId}")
	public ResponseEntity<?> terminateContract(@PathVariable("contractId") Long contractId) {
		return ResponseEntity.ok(contractServices.terminateContract(contractId));
	}

	@GetMapping("/detail/{contractId}")
	public ResponseEntity<DetailContractResponse> viewDetailContractById(
			@PathVariable("contractId") String contractId) {

		DetailContractResponse currentContractResponse = contractServices.viewDetailContractById(contractId);

		return new ResponseEntity<>(currentContractResponse, HttpStatus.OK);
	}

	@GetMapping("/innkeeper/list/{roomId}")
	public ResponseEntity<List<InnkeeperContractResponse>> listInnkeeperContract(
			@PathVariable("roomId") String roomId) {
		return new ResponseEntity<>(contractServices.listInnkeeperContract(roomId), HttpStatus.OK);
	}

	@GetMapping("/account/list-wait")
	public ResponseEntity<?> listAllContractWaiting(@RequestParam("page") int page) {

		Page<Contract> pageContract = contractServices.findAllWaitingContract(accountServices.getCurrentAccountId(),
				ContractConstant.WAITING_TENANT_CONFIRM, page);

		ListContractWaitResponse response = new ListContractWaitResponse();

		List<TenantContractVO> contractVOs = new ArrayList<>();

		for (Contract contract : pageContract.getContent()) {
			TenantContractVO contractVO = new TenantContractVO();

			contractVO.setId(contract.getId());

			contractVO.setTitle(contract.getRoomDetail().getRoom().getTitle());

			contractVO.setAddress(contract.getContractCreateAddress());

			contractVO.setRoomNo(contract.getRoomDetail().getRoomNo());

			contractVO.setRentalPrice(contract.getRentalPrice());

			contractVO.setInnkeeperName(contract.getAccount().getFullName());

			contractVO.setInnkeeperPhone(contract.getAccount().getPhoneNumber());

			contractVO.setTenantName(contract.getAccountTenant().getFullName());

			contractVO.setTenantPhone(contract.getAccountTenant().getPhoneNumber());

			contractVO.setContractCreateDate(contract.getContractCreateDate());
			
			contractVO.setRoomId(contract.getRoom().getId());
			
			contractVO.setInnkeeperUsername(contract.getAccount().getUserName());
			
			contractVOs.add(contractVO);
		}

		response.setContractVOs(contractVOs);

		response.setCurrentPage(pageContract.getNumber() + 1);

		response.setTotalItems((int) pageContract.getTotalElements());

		response.setTotalPages(pageContract.getTotalPages());

		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
