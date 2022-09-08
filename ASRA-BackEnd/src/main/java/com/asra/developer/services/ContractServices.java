package com.asra.developer.services;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.asra.developer.common.constants.ContractConstant;
import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.constants.PaymentConstant;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.models.entity.Contract;
import com.asra.developer.models.entity.RoomDetail;
import com.asra.developer.models.payload.request.CreateBillRequest;
import com.asra.developer.models.payload.request.CreateContractRequest;
import com.asra.developer.models.payload.response.ContractCreateResponse;
import com.asra.developer.models.payload.response.DetailContractResponse;
import com.asra.developer.models.payload.response.InnkeeperContractResponse;
import com.asra.developer.models.payload.response.InnkeeperInformationResponse;
import com.asra.developer.models.payload.response.MessageResponse;
import com.asra.developer.repository.BillRepository;
import com.asra.developer.repository.ContractRepository;
import com.asra.developer.repository.RoomDetailRepository;
import com.asra.developer.repository.RoomRepository;
import com.asra.developer.repository.basic.DepositRepositoryBasic;

@Service
public class ContractServices {

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private ContractRepository contractRepository;

	@Autowired
	private BillRepository billRepository;

	@Autowired
	private AccountServices accountServices;

	@Autowired
	private RoomDetailServices roomDetailServices;

	@Autowired
	private RoomServices roomServices;

	@Autowired
	private InnkeeperSevices innkeeperSevices;

	@Autowired
	private BillServices billServices;
	
	@Autowired
	private RoomRepository roomRepository;
	
	@Autowired
	private DepositRepositoryBasic depositRepositoryBasic;
	
	@Autowired
	private RoomDetailRepository roomDetailRepository;

	public ContractCreateResponse createContract(CreateContractRequest createContractRequest) {

		try {
			Contract contract = mapper.map(createContractRequest, Contract.class);

			contract.setAccount(accountServices.getCurrentAccount());
			contract.setAccountTenant(accountServices.getAccountById(createContractRequest.getAccountTenantId()));
			contract.setRoomDetail(roomDetailServices.getRoomDetailById(createContractRequest.getRoomDetailId()));
			contract.setRoom(roomServices.getRoomById(createContractRequest.getRoomId()));
			contract.setStatus(ContractConstant.WAITING_TENANT_CONFIRM);

			// Set status for roomDetail
			roomDetailServices.setStatusRoomDetailRented(createContractRequest.getRoomDetailId());
			
			
			
			Long contractId = contractRepository.save(contract).getId();

			// Create bill for create contract.
			CreateBillRequest createBillRequest = new CreateBillRequest();
			createBillRequest.setType(SystemConstants.BILL_CONTRACT);
			createBillRequest.setPayerId(createContractRequest.getAccountTenantId());
			createBillRequest.setContractId(contractId);
			createBillRequest.setDues(createContractRequest.getPaymentDate());
			billServices.createBill(createBillRequest);
			
			//Check and update invisible and refurn deposit holder if room detail is full
			roomRepository.CheckVisibleRoomAfterCreateContract(createContractRequest.getRoomId());
			depositRepositoryBasic.RefundDepositAfterCreateLastContract(createContractRequest.getRoomId());
			
			return new ContractCreateResponse(contractId, new MessageResponse(MessageConstants.MSI017));
		} catch (Exception e) {
			throw new BussinessExeption(MessageConstants.MSE001);
		}
	}
	
	public ContractCreateResponse requestTerminateContract(Long contractId) {
		Contract currentContract = contractRepository.findById(contractId).get();
		
		if(currentContract.getStatus().equals(ContractConstant.REQUEST_TERMINATE)) {
			throw new BussinessExeption(MessageConstants.MSE030);
		}
		
		currentContract.setStatus(ContractConstant.REQUEST_TERMINATE);
		contractRepository.save(currentContract);
		
		return new ContractCreateResponse(contractId, new MessageResponse(MessageConstants.MSI029));
	}
	
	
	public ContractCreateResponse terminateContract(Long contractId) {
		Contract currentContract = contractRepository.findById(contractId).get();
		RoomDetail currentRoomDetail = roomDetailRepository.findById(currentContract.getRoomDetail().getId()).get();
		
		
				
		currentRoomDetail.setRoomStatus(false);
		currentContract.setStatus(ContractConstant.TERMINATE);
		contractRepository.save(currentContract);
		
		//Check and update visible if room detail is available
		roomRepository.CheckVisibleRoomAfterTerminateContract(currentContract.getRoomDetail().getRoom().getId());

				
		return new ContractCreateResponse(contractId, new MessageResponse(MessageConstants.MSI028));
	}

	public DetailContractResponse viewDetailContractById(String contractId) {
		Optional<Contract> currentContractOp = contractRepository.findById(Long.parseLong(contractId));

		if (!currentContractOp.isPresent()) {
			throw new BussinessExeption(MessageConstants.MSE018);
		}

		Contract currentContract = currentContractOp.get();

		if (currentContract.getAccount().getId() != accountServices.getCurrentAccountId()
				&& currentContract.getAccountTenant().getId() != accountServices.getCurrentAccountId()) {
			throw new BussinessExeption(MessageConstants.MSE018);
		}

		DetailContractResponse detailContractResponse = mapper.map(currentContract, DetailContractResponse.class);
		detailContractResponse.setContractId(currentContract.getId());
		detailContractResponse.setTenantId(currentContract.getAccountTenant().getId());
		detailContractResponse.setBillId(billServices
				.getBillByContractIdAndType(Long.parseLong(contractId), SystemConstants.BILL_CONTRACT).getId());

		InnkeeperInformationResponse innkeeperInformationResponse = innkeeperSevices
				.getInnkeeperInformation(currentContract.getAccount().getId());
		detailContractResponse.setInnkeeperBirthdate(innkeeperInformationResponse.getIcBirthdate());
		detailContractResponse.setInnkeeperDateOfIssuanceOfIdentityCard(innkeeperInformationResponse.getIcIssueDate());
		detailContractResponse.setInnkeeperIdentityCardNo(innkeeperInformationResponse.getIcId());
		detailContractResponse.setInnkeeperName(innkeeperInformationResponse.getIcName());
		detailContractResponse.setInnkeeperPermanentResidence(innkeeperInformationResponse.getIcIssueLoc());
		detailContractResponse.setInnkeeperPhoneNumber(innkeeperInformationResponse.getPhoneNumber());
		detailContractResponse.setInnkeeperThePlaceIdentityCard(innkeeperInformationResponse.getIcAddress());
		detailContractResponse.setInnkeeperId(innkeeperInformationResponse.getAccountId());
		return detailContractResponse;
	}

	public List<InnkeeperContractResponse> listInnkeeperContract(String roomId) {
		Long innkeeperId = accountServices.getCurrentAccountId();
		List<InnkeeperContractResponse> innkeeperContractResponses = new ArrayList<InnkeeperContractResponse>();

		List<Contract> contracts = contractRepository.findContractByAccountIdAndRoomId(innkeeperId,
				Long.parseLong(roomId));

		int currentMonth = Calendar.getInstance().get(Calendar.MONTH) + 1;
		int currentyear = Calendar.getInstance().get(Calendar.YEAR);

		for (Contract contract : contracts) {
			InnkeeperContractResponse innkeeperContractResponse = mapper.map(contract, InnkeeperContractResponse.class);
			innkeeperContractResponse.setAccountInnkeeperId(innkeeperId);
			innkeeperContractResponse.setAccountTenantId(contract.getAccountTenant().getId());
			innkeeperContractResponse.setRoomDetailid(contract.getRoomDetail().getId());
			innkeeperContractResponse.setRoomDetailName(contract.getRoomDetail().getRoomNo());

			String currentPaymentStatus = billRepository.getBillStatusByContractAndMonthAndYear(contract.getId(),
					currentMonth, currentyear);
			innkeeperContractResponse.setPaymentStatus(
					currentPaymentStatus != null ? currentPaymentStatus : PaymentConstant.WAITING_CREATE_BILL);

			innkeeperContractResponses.add(innkeeperContractResponse);
		}
		return innkeeperContractResponses;
	}

	public Page<Contract> findAllByTenant(Long id, String status, int page) {
		Pageable paging = PageRequest.of(page - 1, SystemConstants.MAX_RESULT, Sort.by("id").descending());
		return contractRepository.findAllByAccountTenantAndStatus(id, status, paging);
	}
	
	public Page<Contract> findAllWaitingContract(Long id, String status, int page) {
		Pageable paging = PageRequest.of(page - 1, SystemConstants.MAX_RESULT, Sort.by("id").descending());
		return contractRepository.findAllWaitingContract(id, status, paging);
	}

}
