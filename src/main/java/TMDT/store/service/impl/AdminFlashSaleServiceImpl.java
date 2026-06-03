package TMDT.store.service.impl;

import TMDT.store.dto.request.AdminFlashSaleItemRequest;
import TMDT.store.dto.request.AdminFlashSaleRequest;
import TMDT.store.dto.response.AdminFlashSaleDetailResponse;
import TMDT.store.dto.response.AdminFlashSaleItemResponse;
import TMDT.store.dto.response.AdminFlashSaleResponse;
import TMDT.store.entity.FlashSale;
import TMDT.store.entity.FlashSaleItem;
import TMDT.store.entity.Product;
import TMDT.store.repository.FlashSaleItemRepository;
import TMDT.store.repository.FlashSaleRepository;
import TMDT.store.repository.ProductRepository;
import TMDT.store.service.AdminFlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminFlashSaleServiceImpl implements AdminFlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminFlashSaleResponse> getAllFlashSales() {
        return flashSaleRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::toFlashSaleResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminFlashSaleDetailResponse getFlashSaleDetail(Long id) {
        FlashSale flashSale = findFlashSaleById(id);

        List<AdminFlashSaleItemResponse> items =
                flashSaleItemRepository.findByFlashSaleId(id)
                        .stream()
                        .map(this::toFlashSaleItemResponse)
                        .toList();

        return AdminFlashSaleDetailResponse.builder()
                .id(flashSale.getId())
                .name(flashSale.getName())
                .startTime(flashSale.getStartTime())
                .endTime(flashSale.getEndTime())
                .active(flashSale.getActive())
                .priority(flashSale.getPriority())
                .status(getStatus(flashSale))
                .items(items)
                .build();
    }

    @Override
    public AdminFlashSaleResponse createFlashSale(AdminFlashSaleRequest request) {
        validateFlashSaleRequest(request);

        Boolean active = Boolean.TRUE.equals(request.getActive());

        if (active) {
            validateNoOtherActiveFlashSale(null);
        }

        FlashSale flashSale = FlashSale.builder()
                .name(request.getName().trim())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .active(active)
                .priority(request.getPriority() != null ? request.getPriority() : 0)
                .build();

        FlashSale saved = flashSaleRepository.save(flashSale);

        return toFlashSaleResponse(saved);
    }

    @Override
    public AdminFlashSaleResponse updateFlashSale(Long id, AdminFlashSaleRequest request) {
        FlashSale flashSale = findFlashSaleById(id);

        validateFlashSaleRequest(request);

        Boolean newActive = Boolean.TRUE.equals(request.getActive());

        if (newActive) {
            validateNoOtherActiveFlashSale(id);
        }

        flashSale.setName(request.getName().trim());
        flashSale.setStartTime(request.getStartTime());
        flashSale.setEndTime(request.getEndTime());
        flashSale.setActive(newActive);
        flashSale.setPriority(request.getPriority() != null ? request.getPriority() : 0);

        FlashSale updated = flashSaleRepository.save(flashSale);

        return toFlashSaleResponse(updated);
    }

    @Override
    public void deleteFlashSale(Long id) {
        FlashSale flashSale = findFlashSaleById(id);
        flashSaleRepository.delete(flashSale);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminFlashSaleItemResponse> getFlashSaleItems(Long flashSaleId) {
        findFlashSaleById(flashSaleId);

        return flashSaleItemRepository.findByFlashSaleId(flashSaleId)
                .stream()
                .map(this::toFlashSaleItemResponse)
                .toList();
    }

    @Override
    public AdminFlashSaleItemResponse addItemToFlashSale(
            Long flashSaleId,
            AdminFlashSaleItemRequest request
    ) {
        FlashSale flashSale = findFlashSaleById(flashSaleId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        validateFlashSaleItemRequest(request, product, false);

        boolean existed = flashSaleItemRepository.existsByFlashSaleIdAndProductId(
                flashSaleId,
                request.getProductId()
        );

        if (existed) {
            throw new RuntimeException("Sản phẩm này đã tồn tại trong chương trình Flash Sale");
        }

        FlashSaleItem item = FlashSaleItem.builder()
                .flashSale(flashSale)
                .product(product)
                .salePrice(request.getSalePrice())
                .quantityLimit(request.getQuantityLimit() != null ? request.getQuantityLimit() : 0)
                .soldQuantity(request.getSoldQuantity() != null ? request.getSoldQuantity() : 0)
                .build();

        FlashSaleItem saved = flashSaleItemRepository.save(item);

        return toFlashSaleItemResponse(saved);
    }

    @Override
    public AdminFlashSaleItemResponse updateFlashSaleItem(
            Long itemId,
            AdminFlashSaleItemRequest request
    ) {
        FlashSaleItem item = flashSaleItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm Flash Sale"));

        Product product = item.getProduct();

        validateFlashSaleItemRequest(request, product, true);

        item.setSalePrice(request.getSalePrice());
        item.setQuantityLimit(request.getQuantityLimit() != null ? request.getQuantityLimit() : 0);
        item.setSoldQuantity(request.getSoldQuantity() != null ? request.getSoldQuantity() : 0);

        FlashSaleItem updated = flashSaleItemRepository.save(item);

        return toFlashSaleItemResponse(updated);
    }

    @Override
    public void deleteFlashSaleItem(Long itemId) {
        FlashSaleItem item = flashSaleItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm Flash Sale"));

        flashSaleItemRepository.delete(item);
    }

    private FlashSale findFlashSaleById(Long id) {
        return flashSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Flash Sale"));
    }

    private void validateFlashSaleRequest(AdminFlashSaleRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Tên Flash Sale không được để trống");
        }

        if (request.getStartTime() == null) {
            throw new RuntimeException("Thời gian bắt đầu không được để trống");
        }

        if (request.getEndTime() == null) {
            throw new RuntimeException("Thời gian kết thúc không được để trống");
        }

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new RuntimeException("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
        }

        if (request.getPriority() != null && request.getPriority() < 0) {
            throw new RuntimeException("Priority không được nhỏ hơn 0");
        }
    }

    private void validateNoOtherActiveFlashSale(Long currentFlashSaleId) {
        LocalDateTime now = LocalDateTime.now();

        List<FlashSale> activeFlashSales;

        if (currentFlashSaleId == null) {
            activeFlashSales = flashSaleRepository.findActiveFlashSalesNotExpired(now);
        } else {
            activeFlashSales = flashSaleRepository.findOtherActiveFlashSalesNotExpired(
                    currentFlashSaleId,
                    now
            );
        }

        if (!activeFlashSales.isEmpty()) {
            FlashSale current = activeFlashSales.get(0);

            throw new RuntimeException(
                    "Hiện tại chương trình \"" + current.getName()
                            + "\" đang được áp dụng, không thể bật chương trình mới."
            );
        }
    }

    private void validateFlashSaleItemRequest(
            AdminFlashSaleItemRequest request,
            Product product,
            boolean updateMode
    ) {
        if (!updateMode && request.getProductId() == null) {
            throw new RuntimeException("Sản phẩm không được để trống");
        }

        if (request.getSalePrice() == null) {
            throw new RuntimeException("Giá Flash Sale không được để trống");
        }

        if (request.getSalePrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Giá Flash Sale phải lớn hơn 0");
        }

        if (request.getSalePrice().compareTo(product.getPrice()) >= 0) {
            throw new RuntimeException("Giá Flash Sale phải nhỏ hơn giá gốc sản phẩm");
        }

        int quantityLimit = request.getQuantityLimit() != null ? request.getQuantityLimit() : 0;
        int soldQuantity = request.getSoldQuantity() != null ? request.getSoldQuantity() : 0;

        if (quantityLimit < 0) {
            throw new RuntimeException("Số lượng giới hạn không được nhỏ hơn 0");
        }

        if (soldQuantity < 0) {
            throw new RuntimeException("Số lượng đã bán không được nhỏ hơn 0");
        }

        if (quantityLimit > 0 && soldQuantity > quantityLimit) {
            throw new RuntimeException("Số lượng đã bán không được lớn hơn số lượng giới hạn");
        }
    }

    private AdminFlashSaleResponse toFlashSaleResponse(FlashSale flashSale) {
        int itemCount = flashSaleItemRepository.findByFlashSaleId(flashSale.getId()).size();

        return AdminFlashSaleResponse.builder()
                .id(flashSale.getId())
                .name(flashSale.getName())
                .startTime(flashSale.getStartTime())
                .endTime(flashSale.getEndTime())
                .active(flashSale.getActive())
                .priority(flashSale.getPriority())
                .status(getStatus(flashSale))
                .itemCount(itemCount)
                .build();
    }

    private AdminFlashSaleItemResponse toFlashSaleItemResponse(FlashSaleItem item) {
        Product product = item.getProduct();

        BigDecimal originalPrice = product.getPrice();
        BigDecimal salePrice = item.getSalePrice();

        int discountPercent = originalPrice
                .subtract(salePrice)
                .multiply(BigDecimal.valueOf(100))
                .divide(originalPrice, 0, RoundingMode.HALF_UP)
                .intValue();

        return AdminFlashSaleItemResponse.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .image(product.getImage())
                .originalPrice(originalPrice)
                .salePrice(salePrice)
                .discountPercent(discountPercent)
                .quantityLimit(item.getQuantityLimit() != null ? item.getQuantityLimit() : 0)
                .soldQuantity(item.getSoldQuantity() != null ? item.getSoldQuantity() : 0)
                .build();
    }

    private String getStatus(FlashSale flashSale) {
        LocalDateTime now = LocalDateTime.now();

        if (!Boolean.TRUE.equals(flashSale.getActive())) {
            return "Đã tắt";
        }

        if (now.isBefore(flashSale.getStartTime())) {
            return "Chưa bắt đầu";
        }

        if (!now.isBefore(flashSale.getEndTime())) {
            return "Đã hết hạn";
        }

        return "Đang áp dụng";
    }
}