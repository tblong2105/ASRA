package com.asra.developer.controllers;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.common.utils.StringUtil;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.AddressMaster;
import com.asra.developer.models.entity.Innkeeper;
import com.asra.developer.models.payload.request.BecomeInnkeeperRequest;
import com.asra.developer.models.payload.request.ChangePasswordRequest;
import com.asra.developer.models.payload.request.EditAccountRequest;
import com.asra.developer.models.payload.request.ForgotPasswordChangeRequest;
import com.asra.developer.models.payload.response.AccountInfoResponse;
import com.asra.developer.models.payload.response.BecomeInnkeeperResponse;
import com.asra.developer.models.payload.response.ForgotPasswordVerifyResponse;
import com.asra.developer.models.payload.response.GetAllAccountDepositedRoomResponse;
import com.asra.developer.models.payload.response.GetAllAccountInnkeeperRoleResponse;
import com.asra.developer.models.payload.response.GetAllAccountResponse;
import com.asra.developer.models.payload.response.MessageResponse;
import com.asra.developer.repository.AccountRepository;
import com.asra.developer.repository.AddressMasterRepositoty;
import com.asra.developer.repository.InnkeeperRepository;
import com.asra.developer.services.AccountServices;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/account")
public class AccountController {

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private AddressMasterRepositoty addressMasterRepositoty;

	@Autowired
	private AccountServices accountServices;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private InnkeeperRepository innkeeperRepository;

	@GetMapping("/get-profile")
	public ResponseEntity<?> getInfomation() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		AccountInfoResponse accountInfoResponse = new AccountInfoResponse();

		if (authentication != null && authentication.getPrincipal() != null) {
			String userName = ((UserDetails) authentication.getPrincipal()).getUsername();

			Optional<Account> userOp = accountRepository.findByUserName(userName);

			if (userOp.isPresent()) {

				Account user = userOp.get();

				accountInfoResponse.setFullName(StringUtil.nullToEmpty(user.getFullName()));

				accountInfoResponse.setEmail(StringUtil.nullToEmpty(user.getEmail()));

				accountInfoResponse.setAge(user.getAge());

				accountInfoResponse.setGender(user.getGender() == null ? "-1" : user.getGender());

				accountInfoResponse.setProfession(StringUtil.nullToEmpty(user.getProfession()));

				accountInfoResponse.setPhoneNumber(StringUtil.nullToEmpty(user.getPhoneNumber()));

				if (user.getAddress() != null) {
					accountInfoResponse.setCity(user.getAddress().getCity());

					accountInfoResponse.setDistrict(user.getAddress().getDistrict());

					accountInfoResponse.setWard(user.getAddress().getWard());

					accountInfoResponse.setStreetName(user.getAddress().getStreetName());
				}
				accountInfoResponse.setImage(StringUtil.nullToEmpty(user.getImage()));

			} else {
				throw new BussinessExeption(MessageConstants.MSE001);
			}

		} else {
			throw new BussinessExeption(MessageConstants.MSE008);
		}

		return new ResponseEntity<>(accountInfoResponse, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/edit-profile")
	public ResponseEntity<?> editInfomation(@Valid @RequestBody EditAccountRequest inputRequest) {
		String userName = accountServices.getCurrentAccountUsername();

		if ("SYSTEM".equals(userName)) {
			throw new BussinessExeption(MessageConstants.MSE008);
		}
		Optional<Account> userOp = accountRepository.findByUserName(userName);

		if (userOp.isPresent()) {

			Account user = userOp.get();

			user.setFullName(StringUtil.nullToEmpty(inputRequest.getFullName()));

			user.setAge(inputRequest.getAge());

			user.setGender(inputRequest.getGender());

			user.setProfession(StringUtil.nullToEmpty(inputRequest.getProfession()));

			user.setPhoneNumber(StringUtil.nullToEmpty(inputRequest.getPhoneNumber()));

			user.setImage(inputRequest.getImage());

			AddressMaster addressMaster = new AddressMaster();

			addressMaster.setCity(inputRequest.getCity());

			addressMaster.setDistrict(inputRequest.getDistrict());

			addressMaster.setWard(inputRequest.getWard());

			addressMaster.setStreetName(inputRequest.getStreetName());

			user.setAddress(addressMasterRepositoty.save(addressMaster));

			this.accountRepository.save(user);

		} else {
			throw new BussinessExeption(MessageConstants.MSE001);
		}

		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI009));
	}

	@Transactional
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest inputRequest) {

		String currentUserName = accountServices.getCurrentAccountUsername();

		Optional<Account> accountOp = accountRepository.findByUserName(currentUserName);

		if (accountOp.isPresent()) {
			try {
				authenticationManager.authenticate(
						new UsernamePasswordAuthenticationToken(currentUserName, inputRequest.getOldPassword()));

				Account account = accountOp.get();

				account.setPassword(encoder.encode(inputRequest.getNewPassword()));

				accountRepository.save(account);
			} catch (AuthenticationException e) {
				throw new BussinessExeption(MessageConstants.MSE011);
			}

		} else {
			throw new BussinessExeption(MessageConstants.MSE008);
		}

		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI012));
	}

	@GetMapping("/become-innkeeper-status")
	public ResponseEntity<?> becomeInnkeeper() {

		Account account = accountServices.getCurrentAccount();

		BecomeInnkeeperResponse response = new BecomeInnkeeperResponse();

		if (account.getInnkeeper().size() == 0) {
			response.setStatusInnkeeper(SystemConstants.INNKEEPER_NONE);
		} else {
			for (Innkeeper ink : account.getInnkeeper()) {
				if (!SystemConstants.INNKEEPER_NONE.equals(ink.getStatus())) {
					response.setStatusInnkeeper(ink.getStatus());
					break;
				}else {
					response.setStatusInnkeeper(SystemConstants.INNKEEPER_NONE);
				}
			}
		}

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/become-innkeeper")
	public ResponseEntity<?> becomeInnkeeper(@Valid @RequestBody BecomeInnkeeperRequest inputRequest) {

		Account account = accountServices.getCurrentAccount();

		if (account.getInnkeeper().size() > 0) {
			for (Innkeeper inn : account.getInnkeeper()) {
				if (SystemConstants.INNKEEPER_DONE.equals(inn.getStatus())
						|| SystemConstants.INNKEEPER_REQUEST.equals(inn.getStatus()))
					throw new BussinessExeption(MessageConstants.MSE015);
			}
		}
		Innkeeper innkeeper = new Innkeeper();

		innkeeper.setAccount(account);

		innkeeper.setFrontImage(inputRequest.getFrontImage());

		innkeeper.setBackImage(inputRequest.getBackImage());

		innkeeper.setIcAddress(inputRequest.getAddress());

		innkeeper.setIcId(inputRequest.getId());

		innkeeper.setIcName(inputRequest.getName());

		innkeeper.setIcBirthdate(inputRequest.getDob());

		innkeeper.setIcIssueDate(inputRequest.getIssue_date());

		innkeeper.setIcIssueLoc(inputRequest.getIssue_loc());

		innkeeper.setStatus(SystemConstants.INNKEEPER_REQUEST);

		innkeeper.setGmailPaypal(inputRequest.getGmailPaypal());

		this.innkeeperRepository.save(innkeeper);

		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI014));
	}

	@GetMapping("/get-all-user-name")
	public ResponseEntity<?> getUsersbyUsername(@RequestParam("username") String username) {

		List<GetAllAccountResponse> getAllAccountListResponse = accountServices.getAcountsByUsername(username);

		return new ResponseEntity<>(getAllAccountListResponse, HttpStatus.OK);
	}

	@GetMapping("/get-all-innkeeper-name")
	public ResponseEntity<?> getUsersbyUsernameAndInnkeeperRole(@RequestParam("username") String username) {

		List<GetAllAccountResponse> getAllAccountListResponse = accountServices
				.getAcountsByUsernameAndInnkeeperRole(username);

		return new ResponseEntity<>(getAllAccountListResponse, HttpStatus.OK);
	}

	@GetMapping("/get-all-user-innkeeper-role")
	public ResponseEntity<?> getAllUsersByInnkeeperRole() {

		List<GetAllAccountInnkeeperRoleResponse> getAllAccountInnkeeperRoleListResponse = accountServices
				.getAllAccountByInnKeeperRole();

		return new ResponseEntity<>(getAllAccountInnkeeperRoleListResponse, HttpStatus.OK);
	}

	@GetMapping("/get-all-user-deposited-room")
	public ResponseEntity<?> getAccountsDepositedRoom(@RequestParam("id") Long roomId) {

		List<GetAllAccountDepositedRoomResponse> getAllAccountDepositedRoomListResponse = accountServices
				.getAccountsDepositedRoom(roomId);

		return new ResponseEntity<>(getAllAccountDepositedRoomListResponse, HttpStatus.OK);
	}

	@Transactional
	@GetMapping("/forgot-password")
	public ResponseEntity<?> forgotPassword(@RequestParam("mail") String mail) {

		accountServices.forgotPassword(mail);

		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI031));
	}

	@Transactional
	@GetMapping("/forgot-password-verify")
	public ResponseEntity<?> forgotPasswordVerify(@RequestParam("token") String token) {

		ForgotPasswordVerifyResponse response = accountServices.forgotPasswordVerify(token);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/forgot-password-change")
	public ResponseEntity<?> forgotPasswordChange(@RequestBody ForgotPasswordChangeRequest req) {

		accountServices.forgotPasswordChange(req);

		return ResponseEntity.ok(new MessageResponse(MessageConstants.MSI032));
	}
}
