package TMDT.store.service;

import TMDT.store.dto.request.CreateOrderRequest;
import TMDT.store.dto.response.OrderResponse;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse getOrderDetail(Integer orderId);
}