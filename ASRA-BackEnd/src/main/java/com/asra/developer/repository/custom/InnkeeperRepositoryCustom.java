package com.asra.developer.repository.custom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.asra.developer.models.entity.Innkeeper;
import com.asra.developer.models.payload.request.admin.GetAllBecomeInnkeeperRequest;

public interface InnkeeperRepositoryCustom {
	Page<Innkeeper> findAllBecomeInnkeeper(GetAllBecomeInnkeeperRequest request, Pageable pageable);
}
