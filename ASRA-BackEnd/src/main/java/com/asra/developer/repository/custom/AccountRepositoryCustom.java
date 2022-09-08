package com.asra.developer.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.asra.developer.models.entity.Account;
import com.asra.developer.models.payload.request.admin.GetAllUserRequest;

public interface AccountRepositoryCustom {
	Page<Account> findUserAdminCustom(GetAllUserRequest request, Pageable pageable);
}
