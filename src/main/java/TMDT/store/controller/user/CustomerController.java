package TMDT.store.controller.user;

import TMDT.store.dto.request.UpdateCustomerProfileRequest;
import TMDT.store.dto.response.CustomerOrderDetailResponse;
import TMDT.store.dto.response.CustomerOrderResponse;
import TMDT.store.dto.response.CustomerProfileResponse;
import TMDT.store.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/profile")
    public CustomerProfileResponse getProfile() {
        return customerService.getProfile();
    }

    @PutMapping("/profile")
    public CustomerProfileResponse updateProfile(
            @RequestBody UpdateCustomerProfileRequest request
    ) {
        return customerService.updateProfile(request);
    }

    @GetMapping("/orders")
    public List<CustomerOrderResponse> getMyOrders() {
        return customerService.getMyOrders();
    }

    @GetMapping("/orders/{orderId}")
    public CustomerOrderDetailResponse getMyOrderDetail(
            @PathVariable Integer orderId
    ) {
        return customerService.getMyOrderDetail(orderId);
    }
}