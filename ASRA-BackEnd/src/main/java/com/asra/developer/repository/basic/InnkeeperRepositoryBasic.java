package com.asra.developer.repository.basic;

import org.springframework.data.jpa.repository.JpaRepository;

import com.asra.developer.models.entity.Innkeeper;

public interface InnkeeperRepositoryBasic extends JpaRepository<Innkeeper, Long> {

	public Innkeeper getByAccountId(Long id);

}
