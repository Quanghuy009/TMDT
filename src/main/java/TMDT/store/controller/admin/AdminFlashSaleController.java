package TMDT.store.controller.admin;

import TMDT.store.dto.request.AdminFlashSaleItemRequest;
import TMDT.store.dto.request.AdminFlashSaleRequest;
import TMDT.store.dto.response.AdminFlashSaleDetailResponse;
import TMDT.store.dto.response.AdminFlashSaleItemResponse;
import TMDT.store.dto.response.AdminFlashSaleResponse;
import TMDT.store.service.AdminFlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/flash-sales")
@RequiredArgsConstructor
public class AdminFlashSaleController {

    private final AdminFlashSaleService adminFlashSaleService;

    @GetMapping
    public ResponseEntity<List<AdminFlashSaleResponse>> getAllFlashSales() {
        return ResponseEntity.ok(adminFlashSaleService.getAllFlashSales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminFlashSaleDetailResponse> getFlashSaleDetail(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminFlashSaleService.getFlashSaleDetail(id));
    }

    @PostMapping
    public ResponseEntity<AdminFlashSaleResponse> createFlashSale(
            @RequestBody AdminFlashSaleRequest request
    ) {
        return ResponseEntity.ok(adminFlashSaleService.createFlashSale(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminFlashSaleResponse> updateFlashSale(
            @PathVariable Long id,
            @RequestBody AdminFlashSaleRequest request
    ) {
        return ResponseEntity.ok(adminFlashSaleService.updateFlashSale(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFlashSale(@PathVariable Long id) {
        adminFlashSaleService.deleteFlashSale(id);
        return ResponseEntity.ok("Xóa Flash Sale thành công");
    }

    @GetMapping("/{flashSaleId}/items")
    public ResponseEntity<List<AdminFlashSaleItemResponse>> getFlashSaleItems(
            @PathVariable Long flashSaleId
    ) {
        return ResponseEntity.ok(
                adminFlashSaleService.getFlashSaleItems(flashSaleId)
        );
    }

    @PostMapping("/{flashSaleId}/items")
    public ResponseEntity<AdminFlashSaleItemResponse> addItemToFlashSale(
            @PathVariable Long flashSaleId,
            @RequestBody AdminFlashSaleItemRequest request
    ) {
        return ResponseEntity.ok(
                adminFlashSaleService.addItemToFlashSale(flashSaleId, request)
        );
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<AdminFlashSaleItemResponse> updateFlashSaleItem(
            @PathVariable Long itemId,
            @RequestBody AdminFlashSaleItemRequest request
    ) {
        return ResponseEntity.ok(
                adminFlashSaleService.updateFlashSaleItem(itemId, request)
        );
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<String> deleteFlashSaleItem(
            @PathVariable Long itemId
    ) {
        adminFlashSaleService.deleteFlashSaleItem(itemId);
        return ResponseEntity.ok("Xóa sản phẩm khỏi Flash Sale thành công");
    }
}