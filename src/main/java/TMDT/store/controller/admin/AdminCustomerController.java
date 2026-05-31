package TMDT.store.controller.admin;

import TMDT.store.dto.response.AdminCustomerResponse;
import TMDT.store.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<AdminCustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllAdminCustomers());
    }

    @PatchMapping("/{userId}/toggle-active")
    public ResponseEntity<AdminCustomerResponse> toggleCustomerActive(
            @PathVariable Integer userId
    ) {
        return ResponseEntity.ok(customerService.toggleCustomerActive(userId));
    }
}