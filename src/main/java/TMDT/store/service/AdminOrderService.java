package TMDT.store.service;

import TMDT.store.dto.request.AdminOrderUpdateRequest;
import TMDT.store.dto.response.AdminOrderDetailResponse;
import TMDT.store.dto.response.AdminOrderResponse;

import java.util.List;

public interface AdminOrderService {

    List<AdminOrderResponse> getAllOrders();

    AdminOrderDetailResponse getOrderDetail(Integer orderId);

    AdminOrderDetailResponse updateOrder(Integer orderId, AdminOrderUpdateRequest request);
}