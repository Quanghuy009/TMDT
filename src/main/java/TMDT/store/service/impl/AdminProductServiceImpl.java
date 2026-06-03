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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    /*
     * Cách này phù hợp khi chạy demo trong IntelliJ.
     * Nếu deploy bằng file .jar, nên đổi sang thư mục ngoài project:
     * Paths.get(System.getProperty("user.dir"), "uploads/products")
     */
    private final Path productImageUploadDir = Paths.get(
            System.getProperty("user.dir"),
            "src/main/resources/static/images/products"
    );

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
    public AdminProductDetailResponse createProduct(
            AdminProductRequest request,
            MultipartFile imageFile
    ) {
        Category category = getCategoryOrThrow(request.getCategoryId());
        Brand brand = getBrandOrThrow(request.getBrandId());

        String imageName = saveProductImage(imageFile);

        if (imageName == null) {
            imageName = "default.jpg";
        }

        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .quantity(request.getQuantity() == null ? 0 : request.getQuantity())
                .image(imageName)
                .category(category)
                .brand(brand)
                .build();

        applySpecs(product, request);

        Product savedProduct = productRepository.save(product);

        return toDetailResponse(savedProduct);
    }

    @Override
    @Transactional
    public AdminProductDetailResponse updateProduct(
            Integer id,
            AdminProductRequest request,
            MultipartFile imageFile
    ) {
        Product product = getProductDetailOrThrow(id);

        Category category = getCategoryOrThrow(request.getCategoryId());
        Brand brand = getBrandOrThrow(request.getBrandId());

        String oldImageName = product.getImage();
        String newImageName = saveProductImage(imageFile);

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity() == null ? 0 : request.getQuantity());

        /*
         * Nếu có upload ảnh mới thì đổi sang ảnh mới.
         * Nếu không upload ảnh mới thì giữ nguyên ảnh cũ.
         */
        if (newImageName != null) {
            product.setImage(newImageName);
        }

        product.setCategory(category);
        product.setBrand(brand);

        /*
         * Không dùng clearSpecs + applySpecs khi update.
         * Vì nếu sản phẩm đã có deviceSpec/headphoneSpec/...,
         * việc tạo new spec sẽ gây duplicate product_id.
         */
        updateSpecs(product, request);

        Product savedProduct = productRepository.save(product);

        /*
         * Chỉ xóa ảnh cũ sau khi DB đã save thành công.
         * Không xóa default.jpg.
         */
        if (newImageName != null) {
            deleteProductImage(oldImageName);
        }

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

        String oldImageName = product.getImage();

        productRepository.delete(product);

        /*
         * Khi xóa sản phẩm thì xóa luôn ảnh riêng của sản phẩm.
         * Nếu ảnh là default.jpg thì không xóa.
         */
        deleteProductImage(oldImageName);
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

    private String saveProductImage(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            return null;
        }

        String contentType = imageFile.getContentType();

        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Chỉ cho phép upload ảnh JPG, PNG hoặc WEBP"
            );
        }

        try {
            Files.createDirectories(productImageUploadDir);

            String originalFilename = imageFile.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String newFilename = UUID.randomUUID() + extension;

            Path targetPath = productImageUploadDir.resolve(newFilename).normalize();

            if (!targetPath.startsWith(productImageUploadDir)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Tên file ảnh không hợp lệ"
                );
            }

            Files.copy(
                    imageFile.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return newFilename;

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không thể lưu ảnh sản phẩm"
            );
        }
    }

    private void deleteProductImage(String filename) {
        if (filename == null || filename.isBlank()) {
            return;
        }

        if ("default.jpg".equalsIgnoreCase(filename)) {
            return;
        }

        try {
            Path imagePath = productImageUploadDir.resolve(filename).normalize();

            if (!imagePath.startsWith(productImageUploadDir)) {
                return;
            }

            Files.deleteIfExists(imagePath);

        } catch (IOException e) {
            System.err.println("Không thể xóa ảnh sản phẩm cũ: " + filename);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }

        return filename.substring(filename.lastIndexOf(".")).toLowerCase();
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