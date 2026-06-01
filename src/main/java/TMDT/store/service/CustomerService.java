package TMDT.store.service;

import TMDT.store.dto.request.UpdateCustomerProfileRequest;
import TMDT.store.dto.response.AdminCustomerResponse;
import TMDT.store.dto.response.CustomerOrderDetailResponse;
import TMDT.store.dto.response.CustomerOrderResponse;
import TMDT.store.dto.response.CustomerProfileResponse;

import java.util.List;

public interface CustomerService {

    // ===== Admin customer management =====

    List<AdminCustomerResponse> getAllAdminCustomers();

    AdminCustomerResponse toggleCustomerActive(Integer userId);


    // ===== Customer account page =====

    CustomerProfileResponse getProfile();

    CustomerProfileResponse updateProfile(UpdateCustomerProfileRequest request);

    List<CustomerOrderResponse> getMyOrders();

    CustomerOrderDetailResponse getMyOrderDetail(Integer orderId);
}