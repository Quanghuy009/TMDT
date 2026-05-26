package TMDT.store.controller.user;

import TMDT.store.dto.request.CreateOrderRequest;
import TMDT.store.dto.response.OrderResponse;
import TMDT.store.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrderDetail(@PathVariable Integer orderId) {
        return orderService.getOrderDetail(orderId);
    }
}