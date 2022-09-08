package com.asra.developer.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.asra.developer.common.constants.MessageConstants;
import com.asra.developer.common.constants.SystemConstants;
import com.asra.developer.common.enums.ERole;
import com.asra.developer.common.error.BussinessExeption;
import com.asra.developer.models.entity.Account;
import com.asra.developer.models.entity.Innkeeper;
import com.asra.developer.models.entity.Payment;
import com.asra.developer.models.entity.Role;
import com.asra.developer.models.entity.Room;
import com.asra.developer.models.payload.request.admin.GetAllBecomeInnkeeperRequest;
import com.asra.developer.models.payload.request.admin.GetAllPaymentRequest;
import com.asra.developer.models.payload.request.admin.GetAllRoomRequest;
import com.asra.developer.models.payload.request.admin.GetAllUserRequest;
import com.asra.developer.repository.AccountRepository;
import com.asra.developer.repository.InnkeeperRepository;
import com.asra.developer.repository.PaymentRepository;
import com.asra.developer.repository.RoleRepository;
import com.asra.developer.repository.RoomRepository;

@Service
public class AdminServices {

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private AccountRepository accountRepository;

	@Autowired
	private InnkeeperRepository innkeeperRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	public Page<Room> getAllRoom(GetAllRoomRequest request) {

		Pageable paging = PageRequest.of(request.getPage() - 1, SystemConstants.MAX_RESULT, Sort.by("id").descending());

		Page<Room> pageRooms = roomRepository.findRoomAdminCustom(request, paging);

		return pageRooms;
	}

	public Page<Account> getAllUser(GetAllUserRequest request) {

		Pageable paging = PageRequest.of(request.getPage() - 1, SystemConstants.MAX_RESULT, Sort.by("id").descending());

		Page<Account> pageRooms = accountRepository.findUserAdminCustom(request, paging);

		return pageRooms;
	}

	public Page<Innkeeper> getAllBecomeInnkeeper(GetAllBecomeInnkeeperRequest request) {

		Pageable paging = PageRequest.of(request.getPage() - 1, SystemConstants.MAX_RESULT, Sort.by("id").descending());

		Page<Innkeeper> pageInnkeepers = innkeeperRepository.findAllBecomeInnkeeper(request, paging);

		return pageInnkeepers;
	}

	public Innkeeper getInnkepperById(Long id) {

		Optional<Innkeeper> opInn = innkeeperRepository.findById(id);

		if (opInn.isPresent()) {
			return opInn.get();
		} else {
			throw new BussinessExeption(MessageConstants.MSE001);
		}
	}

	/**
	 * @param id
	 * @param status "OK" | "NG"
	 */
	public void updateStatusInnkeeper(Long id, String status) {
		Optional<Innkeeper> opInn = innkeeperRepository.findById(id);
		if (opInn.isPresent()) {
			Innkeeper inn = opInn.get();
			if ("OK".equals(status)) {
				inn.setStatus(SystemConstants.INNKEEPER_DONE);
				Account acc = inn.getAccount();
				boolean isInkeeper = false;
				for (Role r : acc.getRoles()) {
					if (r.getName().equals(ERole.ROLE_INNKEEPER) || r.getName().equals(ERole.ROLE_ADMIN)) {
						isInkeeper = true;
					}
				}
				if (isInkeeper) {
					throw new BussinessExeption(MessageConstants.MSE001);
				} else {
					Optional<Role> roleInnkeeperOp = roleRepository.findByName(ERole.ROLE_INNKEEPER);
					if (roleInnkeeperOp.isPresent()) {
						acc.getRoles().add(roleInnkeeperOp.get());
					} else {
						throw new BussinessExeption(MessageConstants.MSE001);
					}
				}
				accountRepository.save(acc);
				innkeeperRepository.save(inn);
			} else {
				inn.setStatus(SystemConstants.INNKEEPER_NONE);
				innkeeperRepository.save(inn);
			}
		} else {
			throw new BussinessExeption(MessageConstants.MSE001);
		}
	}

	public Page<Payment> getAllPayments(GetAllPaymentRequest request) {

		Pageable paging = PageRequest.of(request.getPage() - 1, SystemConstants.MAX_RESULT);

		Page<Payment> pagePayments = paymentRepository.findPaymentAdmin(request, paging);

		return pagePayments;
	}
}
