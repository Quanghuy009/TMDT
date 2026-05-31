package TMDT.store.controller.admin;

import TMDT.store.dto.request.AdminOrderUpdateRequest;
import TMDT.store.dto.response.AdminOrderDetailResponse;
import TMDT.store.dto.response.AdminOrderResponse;
import TMDT.store.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<List<AdminOrderResponse>> getAllOrders() {
        return ResponseEntity.ok(adminOrderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminOrderDetailResponse> getOrderDetail(
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(adminOrderService.getOrderDetail(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminOrderDetailResponse> updateOrder(
            @PathVariable Integer id,
            @RequestBody AdminOrderUpdateRequest request
    ) {
        return ResponseEntity.ok(adminOrderService.updateOrder(id, request));
    }
}