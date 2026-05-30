package TMDT.store.service.impl;

import TMDT.store.dto.request.AdminProductRequest;
import TMDT.store.dto.response.AdminProductDetailResponse;
import TMDT.store.dto.response.AdminProductResponse;
import TMDT.store.entity.*;
import TMDT.store.repository.BrandRepository;
import TMDT.store.repository.CategoryRepository;
import TMDT.store.repository.ProductRepository;
import TMDT.store.service.AdminProductService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public AdminProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    @Override
    public List<AdminProductResponse> getAllProductsForAdmin() {
        return productRepository.findAllAdminProducts();
    }

    @Override
    public AdminProductDetailResponse getProductDetailForAdmin(Integer id) {
        Product product = getProductDetailOrThrow(id);
        return toDetailResponse(product);
    }

    @Override
    @Transactional
    public AdminProductDetailResponse createProduct(AdminProductRequest request) {
        Category category = getCategoryOrThrow(request.getCategoryId());
        Brand brand = getBrandOrThrow(request.getBrandId());

        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .quantity(request.getQuantity() == null ? 0 : request.getQuantity())
                .image(normalizeImage(request.getImage()))
                .category(category)
                .brand(brand)
                .build();

        applySpecs(product, request);

        Product savedProduct = productRepository.save(product);

        return toDetailResponse(savedProduct);
    }

    @Override
    @Transactional
    public AdminProductDetailResponse updateProduct(Integer id, AdminProductRequest request) {
        Product product = getProductDetailOrThrow(id);

        Category category = getCategoryOrThrow(request.getCategoryId());
        Brand brand = getBrandOrThrow(request.getBrandId());

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity() == null ? 0 : request.getQuantity());
        product.setImage(normalizeImage(request.getImage()));
        product.setCategory(category);
        product.setBrand(brand);

        /*
         * Không dùng clearSpecs + applySpecs khi update.
         * Vì nếu sản phẩm đã có deviceSpec/headphoneSpec/...,
         * việc tạo new spec sẽ gây duplicate product_id.
         */
        updateSpecs(product, request);

        Product savedProduct = productRepository.save(product);

        return toDetailResponse(savedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy sản phẩm"
                ));

        productRepository.delete(product);
    }

    private Product getProductDetailOrThrow(Integer id) {
        return productRepository.findDetailById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy sản phẩm"
                ));
    }

    private Category getCategoryOrThrow(Integer categoryId) {
        if (categoryId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Danh mục không được để trống"
            );
        }

        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy danh mục"
                ));
    }

    private Brand getBrandOrThrow(Integer brandId) {
        if (brandId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thương hiệu không được để trống"
            );
        }

        return brandRepository.findById(brandId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy thương hiệu"
                ));
    }

    private String normalizeImage(String image) {
        if (image == null || image.trim().isEmpty()) {
            return null;
        }

        return image.trim();
    }

    /*
     * Dùng cho createProduct.
     * Khi thêm mới sản phẩm, product chưa có spec cũ nên có thể tạo new spec.
     */
    private void applySpecs(Product product, AdminProductRequest request) {
        String categoryName = product.getCategory().getName();

        if (isDeviceCategory(categoryName)) {
            applyDeviceSpec(product, request.getDeviceSpec());
            return;
        }

        if ("Phụ kiện".equalsIgnoreCase(categoryName)) {
            String accessoryType = request.getAccessoryType();

            if ("headphone".equalsIgnoreCase(accessoryType)) {
                applyHeadphoneSpec(product, request.getHeadphoneSpec());
                return;
            }

            if ("keyboard".equalsIgnoreCase(accessoryType)) {
                applyKeyboardSpec(product, request.getKeyboardSpec());
                return;
            }

            if ("mouse".equalsIgnoreCase(accessoryType)) {
                applyMouseSpec(product, request.getMouseSpec());
                return;
            }

            if ("speaker".equalsIgnoreCase(accessoryType)) {
                applySpeakerSpec(product, request.getSpeakerSpec());
            }
        }
    }

    /*
     * Dùng cho updateProduct.
     * Nếu spec đã tồn tại thì cập nhật object cũ.
     * Nếu chưa tồn tại thì mới tạo spec mới.
     */
    private void updateSpecs(Product product, AdminProductRequest request) {
        String categoryName = product.getCategory().getName();

        if (isDeviceCategory(categoryName)) {
            product.setHeadphoneSpec(null);
            product.setKeyboardSpec(null);
            product.setMouseSpec(null);
            product.setSpeakerSpec(null);

            updateDeviceSpec(product, request.getDeviceSpec());
            return;
        }

        if ("Phụ kiện".equalsIgnoreCase(categoryName)) {
            product.setDeviceSpec(null);

            String accessoryType = request.getAccessoryType();

            if ("headphone".equalsIgnoreCase(accessoryType)) {
                product.setKeyboardSpec(null);
                product.setMouseSpec(null);
                product.setSpeakerSpec(null);

                updateHeadphoneSpec(product, request.getHeadphoneSpec());
                return;
            }

            if ("keyboard".equalsIgnoreCase(accessoryType)) {
                product.setHeadphoneSpec(null);
                product.setMouseSpec(null);
                product.setSpeakerSpec(null);

                updateKeyboardSpec(product, request.getKeyboardSpec());
                return;
            }

            if ("mouse".equalsIgnoreCase(accessoryType)) {
                product.setHeadphoneSpec(null);
                product.setKeyboardSpec(null);
                product.setSpeakerSpec(null);

                updateMouseSpec(product, request.getMouseSpec());
                return;
            }

            if ("speaker".equalsIgnoreCase(accessoryType)) {
                product.setHeadphoneSpec(null);
                product.setKeyboardSpec(null);
                product.setMouseSpec(null);

                updateSpeakerSpec(product, request.getSpeakerSpec());
            }
        }
    }

    private boolean isDeviceCategory(String categoryName) {
        return "Điện thoại".equalsIgnoreCase(categoryName)
                || "Laptop".equalsIgnoreCase(categoryName)
                || "Tablet".equalsIgnoreCase(categoryName);
    }

    /*
     * Các hàm apply dùng cho thêm mới.
     */

    private void applyDeviceSpec(Product product, AdminProductRequest.DeviceSpecRequest request) {
        if (request == null) return;

        DeviceSpec spec = new DeviceSpec();

        spec.setProduct(product);
        spec.setCpuChip(request.getCpuChip());
        spec.setGpuChip(request.getGpuChip());
        spec.setRam(request.getRam());
        spec.setStorageCapacity(request.getStorageCapacity());
        spec.setFrontCamera(request.getFrontCamera());
        spec.setRearCamera(request.getRearCamera());
        spec.setScreenSize(request.getScreenSize());
        spec.setScreenResolution(request.getScreenResolution());
        spec.setDisplayTechnology(request.getDisplayTechnology());
        spec.setBatteryCapacity(request.getBatteryCapacity());
        spec.setChargingPower(request.getChargingPower());
        spec.setUtilities(request.getUtilities());

        product.setDeviceSpec(spec);
    }

    private void applyHeadphoneSpec(Product product, AdminProductRequest.HeadphoneSpecRequest request) {
        if (request == null) return;

        HeadphoneSpec spec = new HeadphoneSpec();

        spec.setProduct(product);
        spec.setHeadphoneType(request.getHeadphoneType());
        spec.setConnectionDistance(request.getConnectionDistance());
        spec.setAudioTechnology(request.getAudioTechnology());
        spec.setCompatibleOs(request.getCompatibleOs());
        spec.setBatteryLife(request.getBatteryLife());
        spec.setJackType(request.getJackType());
        spec.setUtilities(request.getUtilities());

        product.setHeadphoneSpec(spec);
    }

    private void applyKeyboardSpec(Product product, AdminProductRequest.KeyboardSpecRequest request) {
        if (request == null) return;

        KeyboardSpec spec = new KeyboardSpec();

        spec.setProduct(product);
        spec.setKeyboardType(request.getKeyboardType());
        spec.setCompatibleOs(request.getCompatibleOs());
        spec.setConnectionDistance(request.getConnectionDistance());
        spec.setWirelessTechnology(request.getWirelessTechnology());
        spec.setKeyboardLayout(request.getKeyboardLayout());
        spec.setKeyCount(request.getKeyCount());
        spec.setSize(request.getSize());
        spec.setUtilities(request.getUtilities());

        product.setKeyboardSpec(spec);
    }

    private void applyMouseSpec(Product product, AdminProductRequest.MouseSpecRequest request) {
        if (request == null) return;

        MouseSpec spec = new MouseSpec();

        spec.setProduct(product);
        spec.setMouseType(request.getMouseType());
        spec.setCompatibleOs(request.getCompatibleOs());
        spec.setConnectionDistance(request.getConnectionDistance());
        spec.setBatteryType(request.getBatteryType());
        spec.setSize(request.getSize());
        spec.setSpecialFeatures(request.getSpecialFeatures());

        product.setMouseSpec(spec);
    }

    private void applySpeakerSpec(Product product, AdminProductRequest.SpeakerSpecRequest request) {
        if (request == null) return;

        SpeakerSpec spec = new SpeakerSpec();

        spec.setProduct(product);
        spec.setSpeakerType(request.getSpeakerType());
        spec.setPowerOutput(request.getPowerOutput());
        spec.setBatteryLife(request.getBatteryLife());
        spec.setAudioTechnology(request.getAudioTechnology());
        spec.setWirelessTechnology(request.getWirelessTechnology());
        spec.setSize(request.getSize());
        spec.setUtilities(request.getUtilities());

        product.setSpeakerSpec(spec);
    }

    /*
     * Các hàm update dùng cho sửa sản phẩm.
     */

    private void updateDeviceSpec(Product product, AdminProductRequest.DeviceSpecRequest request) {
        if (request == null) return;

        DeviceSpec spec = product.getDeviceSpec();

        if (spec == null) {
            spec = new DeviceSpec();
            spec.setProduct(product);
            product.setDeviceSpec(spec);
        }

        spec.setCpuChip(request.getCpuChip());
        spec.setGpuChip(request.getGpuChip());
        spec.setRam(request.getRam());
        spec.setStorageCapacity(request.getStorageCapacity());
        spec.setFrontCamera(request.getFrontCamera());
        spec.setRearCamera(request.getRearCamera());
        spec.setScreenSize(request.getScreenSize());
        spec.setScreenResolution(request.getScreenResolution());
        spec.setDisplayTechnology(request.getDisplayTechnology());
        spec.setBatteryCapacity(request.getBatteryCapacity());
        spec.setChargingPower(request.getChargingPower());
        spec.setUtilities(request.getUtilities());
    }

    private void updateHeadphoneSpec(Product product, AdminProductRequest.HeadphoneSpecRequest request) {
        if (request == null) return;

        HeadphoneSpec spec = product.getHeadphoneSpec();

        if (spec == null) {
            spec = new HeadphoneSpec();
            spec.setProduct(product);
            product.setHeadphoneSpec(spec);
        }

        spec.setHeadphoneType(request.getHeadphoneType());
        spec.setConnectionDistance(request.getConnectionDistance());
        spec.setAudioTechnology(request.getAudioTechnology());
        spec.setCompatibleOs(request.getCompatibleOs());
        spec.setBatteryLife(request.getBatteryLife());
        spec.setJackType(request.getJackType());
        spec.setUtilities(request.getUtilities());
    }

    private void updateKeyboardSpec(Product product, AdminProductRequest.KeyboardSpecRequest request) {
        if (request == null) return;

        KeyboardSpec spec = product.getKeyboardSpec();

        if (spec == null) {
            spec = new KeyboardSpec();
            spec.setProduct(product);
            product.setKeyboardSpec(spec);
        }

        spec.setKeyboardType(request.getKeyboardType());
        spec.setCompatibleOs(request.getCompatibleOs());
        spec.setConnectionDistance(request.getConnectionDistance());
        spec.setWirelessTechnology(request.getWirelessTechnology());
        spec.setKeyboardLayout(request.getKeyboardLayout());
        spec.setKeyCount(request.getKeyCount());
        spec.setSize(request.getSize());
        spec.setUtilities(request.getUtilities());
    }

    private void updateMouseSpec(Product product, AdminProductRequest.MouseSpecRequest request) {
        if (request == null) return;

        MouseSpec spec = product.getMouseSpec();

        if (spec == null) {
            spec = new MouseSpec();
            spec.setProduct(product);
            product.setMouseSpec(spec);
        }

        spec.setMouseType(request.getMouseType());
        spec.setCompatibleOs(request.getCompatibleOs());
        spec.setConnectionDistance(request.getConnectionDistance());
        spec.setBatteryType(request.getBatteryType());
        spec.setSize(request.getSize());
        spec.setSpecialFeatures(request.getSpecialFeatures());
    }

    private void updateSpeakerSpec(Product product, AdminProductRequest.SpeakerSpecRequest request) {
        if (request == null) return;

        SpeakerSpec spec = product.getSpeakerSpec();

        if (spec == null) {
            spec = new SpeakerSpec();
            spec.setProduct(product);
            product.setSpeakerSpec(spec);
        }

        spec.setSpeakerType(request.getSpeakerType());
        spec.setPowerOutput(request.getPowerOutput());
        spec.setBatteryLife(request.getBatteryLife());
        spec.setAudioTechnology(request.getAudioTechnology());
        spec.setWirelessTechnology(request.getWirelessTechnology());
        spec.setSize(request.getSize());
        spec.setUtilities(request.getUtilities());
    }

    private AdminProductDetailResponse toDetailResponse(Product product) {
        return AdminProductDetailResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .image(product.getImage())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .brandId(product.getBrand().getId())
                .brandName(product.getBrand().getName())
                .accessoryType(resolveAccessoryType(product))
                .deviceSpec(toDeviceSpecResponse(product.getDeviceSpec()))
                .headphoneSpec(toHeadphoneSpecResponse(product.getHeadphoneSpec()))
                .keyboardSpec(toKeyboardSpecResponse(product.getKeyboardSpec()))
                .mouseSpec(toMouseSpecResponse(product.getMouseSpec()))
                .speakerSpec(toSpeakerSpecResponse(product.getSpeakerSpec()))
                .build();
    }

    private String resolveAccessoryType(Product product) {
        if (product.getHeadphoneSpec() != null) return "headphone";
        if (product.getKeyboardSpec() != null) return "keyboard";
        if (product.getMouseSpec() != null) return "mouse";
        if (product.getSpeakerSpec() != null) return "speaker";

        return null;
    }

    private AdminProductRequest.DeviceSpecRequest toDeviceSpecResponse(DeviceSpec spec) {
        if (spec == null) return null;

        return new AdminProductRequest.DeviceSpecRequest(
                spec.getCpuChip(),
                spec.getGpuChip(),
                spec.getRam(),
                spec.getStorageCapacity(),
                spec.getFrontCamera(),
                spec.getRearCamera(),
                spec.getScreenSize(),
                spec.getScreenResolution(),
                spec.getDisplayTechnology(),
                spec.getBatteryCapacity(),
                spec.getChargingPower(),
                spec.getUtilities()
        );
    }

    private AdminProductRequest.HeadphoneSpecRequest toHeadphoneSpecResponse(HeadphoneSpec spec) {
        if (spec == null) return null;

        return new AdminProductRequest.HeadphoneSpecRequest(
                spec.getHeadphoneType(),
                spec.getConnectionDistance(),
                spec.getAudioTechnology(),
                spec.getCompatibleOs(),
                spec.getBatteryLife(),
                spec.getJackType(),
                spec.getUtilities()
        );
    }

    private AdminProductRequest.KeyboardSpecRequest toKeyboardSpecResponse(KeyboardSpec spec) {
        if (spec == null) return null;

        return new AdminProductRequest.KeyboardSpecRequest(
                spec.getKeyboardType(),
                spec.getCompatibleOs(),
                spec.getConnectionDistance(),
                spec.getWirelessTechnology(),
                spec.getKeyboardLayout(),
                spec.getKeyCount(),
                spec.getSize(),
                spec.getUtilities()
        );
    }

    private AdminProductRequest.MouseSpecRequest toMouseSpecResponse(MouseSpec spec) {
        if (spec == null) return null;

        return new AdminProductRequest.MouseSpecRequest(
                spec.getMouseType(),
                spec.getCompatibleOs(),
                spec.getConnectionDistance(),
                spec.getBatteryType(),
                spec.getSize(),
                spec.getSpecialFeatures()
        );
    }

    private AdminProductRequest.SpeakerSpecRequest toSpeakerSpecResponse(SpeakerSpec spec) {
        if (spec == null) return null;

        return new AdminProductRequest.SpeakerSpecRequest(
                spec.getSpeakerType(),
                spec.getPowerOutput(),
                spec.getBatteryLife(),
                spec.getAudioTechnology(),
                spec.getWirelessTechnology(),
                spec.getSize(),
                spec.getUtilities()
        );
    }
}