package com.asra.developer.services;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Optional;

import javax.mail.MessagingException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asra.developer.common.constants.ContractConstant;
import com.asra.developer.common.constants.DepositConstant;
import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.constants.PaymentConstant;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.Bill;
import com.asra.developer.models.entity.Contract;
import com.asra.developer.models.entity.Deposit;
import com.asra.developer.models.entity.Innkeeper;
import com.asra.developer.models.entity.Payment;
import com.asra.developer.models.payload.request.CreateBillRequest;
import com.asra.developer.models.payload.request.PaymentBillRequest;
import com.asra.developer.models.payload.request.SendMailMonthlyVO;
import com.asra.developer.models.payload.response.BillDetailResponse;
import com.asra.developer.models.payload.response.CreateBillNormalResponse;
import com.asra.developer.models.payload.response.PaymentBillResponse;
import com.asra.developer.repository.BillRepository;
import com.asra.developer.repository.ContractRepository;
import com.asra.developer.repository.DepositRepository;
import com.asra.developer.repository.PaymentRepository;
import com.paypal.base.rest.PayPalRESTException;

@Service
public class BillServices {

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private BillRepository billRepository;

	@Autowired
	private AccountServices accountServices;

	@Autowired
	private ContractRepository contractRepository;

	@Autowired
	private DepositRepository depositRepository;

	@Autowired
	private PayPalServices payPalServices;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private MailServices mailServices;

	public Bill getBillByContractIdAndType(Long contractId, String type) {
		return billRepository.getBillByContractIdAndType(contractId, type);
	}

	public BillDetailResponse getBillById(Long billId) {

		Optional<Bill> currentBillOp = billRepository.findById(billId);

		if (!currentBillOp.isPresent()) {
			throw new BussinessExeption(MessageConstants.MSE020);
		}

		Bill currentBill = currentBillOp.get();

		BillDetailResponse billDetailResponse = mapper.map(currentBill, BillDetailResponse.class);

		// Payee Infor
		billDetailResponse.setBillPayeeId(currentBill.getBillPayee().getId());
		billDetailResponse.setBillPayeeName(currentBill.getBillPayee().getFullName());
		billDetailResponse.setBillPayeeAddress(currentBill.getBillPayee().getAddress().getStreetName() + ", "
				+ currentBill.getBillPayee().getAddress().getWard() + ", "
				+ currentBill.getBillPayee().getAddress().getDistrict() + ", "
				+ currentBill.getBillPayee().getAddress().getCity());
		// Payer Infor
		billDetailResponse.setBillPayerId(currentBill.getBillPayer().getId());
		billDetailResponse.setBillPayerName(currentBill.getBillPayer().getFullName());
		billDetailResponse.setBillPayerAddesss(currentBill.getBillPayer().getAddress().getStreetName() + ", "
				+ currentBill.getBillPayer().getAddress().getWard() + ", "
				+ currentBill.getBillPayer().getAddress().getDistrict() + ", "
				+ currentBill.getBillPayer().getAddress().getCity());

		// Contract Infor
		billDetailResponse.setContractId(currentBill.getContract().getId());
		billDetailResponse.setContractCreateAddress(currentBill.getContract().getContractCreateAddress());
		billDetailResponse.setContractStatus(currentBill.getContract().getStatus());

		return billDetailResponse;
	}

	public CreateBillNormalResponse createBill(CreateBillRequest createBillRequest) {
		Bill bill = new Bill();

		Account payeeAccount = accountServices.getCurrentAccount();
		Account payerAccount = accountServices.getAccountById(createBillRequest.getPayerId());
		Contract contract = contractRepository.getById(createBillRequest.getContractId());

		BigDecimal deposit = contract.getDeposit();
		BigDecimal rentalprice = contract.getRentalPrice();

		bill.setRentalPrice(rentalprice);
		bill.setBillPayee(payeeAccount);
		bill.setBillPayer(payerAccount);
		bill.setContract(contract);
		bill.setDues(createBillRequest.getDues());
		bill.setStatus(PaymentConstant.NOT_YET);
		bill.setRoomId(contract.getRoom().getId());
		bill.setRoomDetailId(contract.getRoomDetail().getId());

		bill.setMonth(Calendar.getInstance().get(Calendar.MONTH) + 1);
		bill.setYear(Calendar.getInstance().get(Calendar.YEAR));
		bill.setDescribe("Payment for room " + contract.getRoomDetail().getRoomNo() + " Thang "
				+ (Calendar.getInstance().get(Calendar.MONTH) + 1) + "/" + Calendar.getInstance().get(Calendar.YEAR)
				+ " at " + contract.getContractCreateAddress());

		if (createBillRequest.getType().equals(SystemConstants.BILL_NORMAL)) {
			BigDecimal electronicPrice = contract.getElectronicPrice();
			BigDecimal waterPrice = contract.getWaterPrice();
			BigDecimal internetPrice = contract.getInternetPrice();

			bill.setDeposit(BigDecimal.ZERO);
			bill.setDepositHolder(BigDecimal.ZERO);

			bill.setElectronicPrice(electronicPrice);
			bill.setWaterPrice(waterPrice);
			bill.setInternetPrice(internetPrice);

			// Calculator total for bill normal

			bill.setKw(createBillRequest.getKw());
			bill.setCapacity(createBillRequest.getCapacity());
			bill.setTotalBill(rentalprice.add(electronicPrice.multiply(new BigDecimal(createBillRequest.getKw())))
					.add(waterPrice.multiply(new BigDecimal(createBillRequest.getCapacity()))).add(internetPrice));
			bill.setType(SystemConstants.BILL_NORMAL);
		} else if (createBillRequest.getType().equals(SystemConstants.BILL_CONTRACT)) {

			Deposit currentDeposit = depositRepository
					.findByAccountIdAndRoomId(createBillRequest.getPayerId(), contract.getRoom().getId()).get();

			// Calculator total for bill contract create
			bill.setElectronicPrice(BigDecimal.ZERO);
			bill.setWaterPrice(BigDecimal.ZERO);
			bill.setInternetPrice(BigDecimal.ZERO);
			bill.setTotalBill(rentalprice.add(deposit).subtract(currentDeposit.getDepositCost()));
			bill.setDepositHolder(currentDeposit.getDepositCost());
			bill.setDeposit(deposit);
			bill.setDepositId(currentDeposit.getId());
			bill.setType(SystemConstants.BILL_CONTRACT);

			currentDeposit.setStatus(DepositConstant.APPROVED);
			depositRepository.save(currentDeposit);

		}
		Long billId = billRepository.save(bill).getId();
		CreateBillNormalResponse createBillNormalResponse = new CreateBillNormalResponse();
		createBillNormalResponse.setBillId(billId);
		createBillNormalResponse.setMessage("Invoice create successfully.");

		if (SystemConstants.BILL_NORMAL.equals(createBillRequest.getType())) {

			SendMailMonthlyVO monthlyVO = new SendMailMonthlyVO();

			monthlyVO.setBillId(billId);

			monthlyVO.setRoomName(StringUtil.getAddressFromDB(contract.getRoom().getAddress()));

			monthlyVO.setRoomDetailId(contract.getRoomDetail().getRoomNo());

			monthlyVO.setYear(bill.getYear());

			monthlyVO.setMonth(bill.getMonth());

			monthlyVO.setDay(bill.getDues());

			monthlyVO.setTotalBill(bill.getTotalBill());

			monthlyVO.setRentalPrice(bill.getRentalPrice());

			monthlyVO.setElectronicPrice(bill.getElectronicPrice());

			monthlyVO.setInternetPrice(bill.getInternetPrice());

			monthlyVO.setWaterPrice(bill.getWaterPrice());

			StringBuilder sb = new StringBuilder();

			sb.append("[ASRA] ");
			sb.append(bill.getDescribe());

			try {
				mailServices.sendMonthlyBill(bill.getBillPayer().getEmail(), sb.toString(), monthlyVO);
			} catch (MessagingException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return createBillNormalResponse;
	}

	public PaymentBillResponse PaymentBill(PaymentBillRequest paymentBillRequest) {
		try {
			Bill currentBill = billRepository.findById(paymentBillRequest.getBillId()).get();
			currentBill.setStatus(PaymentConstant.PAID);
			currentBill.setPaymentId(paymentBillRequest.getPaymentId());

			if (SystemConstants.BILL_CONTRACT.equals(currentBill.getType())) {
				Contract currentContract = contractRepository.findById(currentBill.getContract().getId()).get();

				BigDecimal total = currentBill.getTotalBill().add(currentBill.getDepositHolder());

				String email = "";
				for (Innkeeper inn : currentBill.getBillPayee().getInnkeeper()) {
					if (SystemConstants.INNKEEPER_DONE.equals(inn.getStatus())) {
						email = inn.getGmailPaypal();
					}
				}
				if (StringUtil.isEmpty(email)) {
					throw new BussinessExeption(MessageConstants.MSE040);
				}

				StringBuilder note = new StringBuilder();
				note.append("Paying contract money from ");
				note.append(currentBill.getBillPayer().getFullName());
				note.append(" of contract code #");
				note.append(currentContract.getId());

				payPalServices.createPayment(email, total, note.toString());

				currentContract.setStatus(ContractConstant.IS_ACTIVE);
				currentContract.setTenantSignature(paymentBillRequest.getTenantSignature());
				contractRepository.save(currentContract);
			} else if (SystemConstants.BILL_NORMAL.equals(currentBill.getType())) {
				BigDecimal total = currentBill.getTotalBill();

				String email = "";
				for (Innkeeper inn : currentBill.getBillPayee().getInnkeeper()) {
					if (SystemConstants.INNKEEPER_DONE.equals(inn.getStatus())) {
						email = inn.getGmailPaypal();
					}
				}
				if (StringUtil.isEmpty(email)) {
					throw new BussinessExeption(MessageConstants.MSE040);
				}

				StringBuilder note = new StringBuilder();

				note.append(currentBill.getBillPayer().getFullName());
				note.append(" has paid monthly room rate for room number ");
				note.append(currentBill.getRoomDetailId());

				payPalServices.createPayment(email, total, note.toString());
			}

			billRepository.save(currentBill);

			PaymentBillResponse paymentBillResponse = new PaymentBillResponse();
			paymentBillResponse.setMessage("Payment successfully.");
			return paymentBillResponse;
		} catch (Exception e) {

			Optional<Payment> pay = paymentRepository.findById(paymentBillRequest.getPaymentId());

			if (pay.isPresent()) {
				Payment refund = pay.get();
				StringBuilder sb = new StringBuilder();
				sb.append("Refund money when create contract or payment monthly!");
				try {
					payPalServices.createPaymentRefund(refund.getPayerEmailAddress(), refund.getPaymentAmount(),
							sb.toString());
				} catch (PayPalRESTException e1) {
					e1.printStackTrace();
					throw new BussinessExeption(MessageConstants.MSE039);
				}
			}

			throw new BussinessExeption(MessageConstants.MSE037);
		}
	}
}
