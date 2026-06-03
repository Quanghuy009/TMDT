package TMDT.store.service;

import TMDT.store.dto.request.AdminFlashSaleItemRequest;
import TMDT.store.dto.request.AdminFlashSaleRequest;
import TMDT.store.dto.response.AdminFlashSaleDetailResponse;
import TMDT.store.dto.response.AdminFlashSaleItemResponse;
import TMDT.store.dto.response.AdminFlashSaleResponse;

import java.util.List;

public interface AdminFlashSaleService {

    List<AdminFlashSaleResponse> getAllFlashSales();

    AdminFlashSaleDetailResponse getFlashSaleDetail(Long id);

    AdminFlashSaleResponse createFlashSale(AdminFlashSaleRequest request);

    AdminFlashSaleResponse updateFlashSale(Long id, AdminFlashSaleRequest request);

    void deleteFlashSale(Long id);

    List<AdminFlashSaleItemResponse> getFlashSaleItems(Long flashSaleId);

    AdminFlashSaleItemResponse addItemToFlashSale(
            Long flashSaleId,
            AdminFlashSaleItemRequest request
    );

    AdminFlashSaleItemResponse updateFlashSaleItem(
            Long itemId,
            AdminFlashSaleItemRequest request
    );

    void deleteFlashSaleItem(Long itemId);
}