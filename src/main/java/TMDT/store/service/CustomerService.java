package TMDT.store.service;

import TMDT.store.dto.response.AdminCustomerResponse;

import java.util.List;

public interface CustomerService {

    List<AdminCustomerResponse> getAllAdminCustomers();

    AdminCustomerResponse toggleCustomerActive(Integer userId);
}