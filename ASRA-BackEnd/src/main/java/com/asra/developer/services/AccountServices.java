package com.asra.developer.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.enums.ERole;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.TokenPassword;
import com.asra.developer.models.payload.request.ForgotPasswordChangeRequest;
import com.asra.developer.models.payload.response.ForgotPasswordVerifyResponse;
import com.asra.developer.models.payload.response.GetAllAccountDepositedRoomResponse;
import com.asra.developer.models.payload.response.GetAllAccountInnkeeperRoleResponse;
import com.asra.developer.models.payload.response.GetAllAccountResponse;
import com.asra.developer.repository.AccountRepository;
import com.asra.developer.repository.CustomRepository;
import com.asra.developer.repository.TokenPasswordRepository;

@Service
public class AccountServices {

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private TokenPasswordRepository passwordRepository;

	@Autowired
	private MailServices mailServices;

	@Autowired
	private CustomRepository customRepo;

	@Autowired
	private PasswordEncoder encoder;

	public String getCurrentAccountUsername() {
		String userName = "SYSTEM";
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {

			Object principal = authentication.getPrincipal();

			if (principal != null && principal instanceof UserDetails) {
				userName = ((UserDetails) authentication.getPrincipal()).getUsername();
			}
		}
		return userName;
	}

	public Account getCurrentAccount() {

		Optional<Account> accountOp = accountRepository.findByUserName(getCurrentAccountUsername());

		if (!accountOp.isPresent()) {
			throw new BussinessExeption(MessageConstants.MSE008);
		}

		return accountOp.get();
	}
	
	public Account getCurrentAccountSon(String username) {

		Optional<Account> accountOp = accountRepository.findByUserName(username);

		if (!accountOp.isPresent()) {
			throw new BussinessExeption(MessageConstants.MSE008);
		}

		return accountOp.get();
	}


	public Long getCurrentAccountId() {
		Optional<Account> accountOp = accountRepository.findByUserName(getCurrentAccountUsername());

		if (!accountOp.isPresent()) {
			throw new BussinessExeption(MessageConstants.MSE008);
		}

		return accountOp.get().getId();
	}

	public Account getAccountById(Long accountId) {
		return accountRepository.getById(accountId);
	}

	public List<GetAllAccountResponse> getAcountsByUsername(String username) {
		List<Account> accountList = accountRepository.getAcountsByUsername(username);
		List<GetAllAccountResponse> getAllAccountListResponse = new ArrayList<GetAllAccountResponse>();

		for (Account a : accountList) {
			GetAllAccountResponse getAllAccountResponse = new GetAllAccountResponse(a.getId(), a.getUserName());
			getAllAccountListResponse.add(getAllAccountResponse);
		}

		return getAllAccountListResponse;
	}

	public List<GetAllAccountResponse> getAcountsByUsernameAndInnkeeperRole(String username) {
		List<Account> accountList = accountRepository.getAcountsByUsernameAndInnkeeperRole(username);
		List<GetAllAccountResponse> getAllAccountListResponse = new ArrayList<GetAllAccountResponse>();

		for (Account a : accountList) {
			GetAllAccountResponse getAllAccountResponse = new GetAllAccountResponse(a.getId(), a.getUserName());
			getAllAccountListResponse.add(getAllAccountResponse);
		}

		return getAllAccountListResponse;
	}

	public List<GetAllAccountInnkeeperRoleResponse> getAllAccountByInnKeeperRole() {
		List<Account> accountList = accountRepository.getAllAccountByRoleName(ERole.ROLE_INNKEEPER);
		List<GetAllAccountInnkeeperRoleResponse> getAllAccountInnkeeperRoleListResponse = new ArrayList<GetAllAccountInnkeeperRoleResponse>();

		for (Account a : accountList) {
			GetAllAccountInnkeeperRoleResponse getAllAccountInnkeeperRoleResponse = new GetAllAccountInnkeeperRoleResponse(
					a.getId(), a.getUserName());
			getAllAccountInnkeeperRoleListResponse.add(getAllAccountInnkeeperRoleResponse);
		}

		return getAllAccountInnkeeperRoleListResponse;
	}

	public List<GetAllAccountDepositedRoomResponse> getAccountsDepositedRoom(Long roomId) {
		List<Account> accountList = accountRepository.getAccountsByRoomIdAndDeposit(roomId);
		List<GetAllAccountDepositedRoomResponse> getAllAccountDepositedRoomListResponse = new ArrayList<GetAllAccountDepositedRoomResponse>();

		for (Account a : accountList) {
			GetAllAccountDepositedRoomResponse getAllAccountInnkeeperRoleResponse = new GetAllAccountDepositedRoomResponse(
					a.getId(), a.getUserName());
			getAllAccountDepositedRoomListResponse.add(getAllAccountInnkeeperRoleResponse);
		}

		return getAllAccountDepositedRoomListResponse;
	}

	public void forgotPassword(String email) {
		if (!accountRepository.existsByEmail(email)) {
			throw new BussinessExeption(MessageConstants.MSE036);
		}

		String checkExits = customRepo.checkExitsTokenCustom(email);

		if ("OK".equals(checkExits)) {
			String token = DigestUtils.md5DigestAsHex((email + String.valueOf(System.currentTimeMillis())).getBytes());

			TokenPassword tokenDb = new TokenPassword();

			tokenDb.setAccount(accountRepository.findByEmail(email).get());

			StringBuilder sb = new StringBuilder();

			tokenDb.setToken(token);

			tokenDb.setStatus(true);

			passwordRepository.save(tokenDb);

			try {
				sb.append(SystemConstants.BASE_URL);
				sb.append("forgot-password-verify/");
				sb.append(token);
				mailServices.sendResetPassword(email, sb.toString());
			} catch (Exception e) {
				e.printStackTrace();
				throw new BussinessExeption(MessageConstants.MSE001);
			}
		} else if ("NG".equals(checkExits)) {
			throw new BussinessExeption(MessageConstants.MSE035);
		} else {
			throw new BussinessExeption(MessageConstants.MSE001);
		}

	}

	public ForgotPasswordVerifyResponse forgotPasswordVerify(String token) {

		List<TokenPassword> tokenPasswords = passwordRepository.findByToken(token);

		if (tokenPasswords.size() > 0) {
			TokenPassword tempToken = tokenPasswords.get(0);
			Date currentDate = new Date(System.currentTimeMillis());
			if (tempToken.isStatus() && DateUtils.isSameDay(tempToken.getInsertDate(), currentDate)) {

				ForgotPasswordVerifyResponse res = new ForgotPasswordVerifyResponse();

				res.setUserName(tempToken.getAccount().getUserName());

				res.setToken(tempToken.getToken());

				return res;
			} else {
				throw new BussinessExeption(MessageConstants.MSE033);
			}

		} else {
			throw new BussinessExeption(MessageConstants.MSE034);
		}

	}

	public void forgotPasswordChange(ForgotPasswordChangeRequest req) {

		List<TokenPassword> tokenPasswords = passwordRepository.findByToken(req.getToken());
		if (tokenPasswords.size() > 0) {
			TokenPassword tempToken = tokenPasswords.get(0);
			Date currentDate = new Date(System.currentTimeMillis());
			if (tempToken.isStatus() && DateUtils.isSameDay(tempToken.getInsertDate(), currentDate)) {

				Account acc = tempToken.getAccount();

				acc.setPassword(encoder.encode(req.getPassword()));

				accountRepository.save(acc);

				tempToken.setStatus(false);

				passwordRepository.save(tempToken);

			} else {
				throw new BussinessExeption(MessageConstants.MSE033);
			}

		} else {
			throw new BussinessExeption(MessageConstants.MSE034);
		}
	}
}
