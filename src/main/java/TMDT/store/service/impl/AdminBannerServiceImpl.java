package TMDT.store.service.impl;

import TMDT.store.dto.response.AdminBannerResponse;
import TMDT.store.entity.Banner;
import TMDT.store.repository.BannerRepository;
import TMDT.store.service.AdminBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminBannerServiceImpl implements AdminBannerService {

    private final BannerRepository bannerRepository;

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    /*
     * Cách này phù hợp khi chạy demo trong IntelliJ.
     * Nếu deploy bằng file .jar, nên đổi sang thư mục ngoài project:
     * Paths.get(System.getProperty("user.dir"), "uploads/banners")
     */
    private final Path bannerImageUploadDir = Paths.get(
            System.getProperty("user.dir"),
            "src/main/resources/static/images/banners"
    );

    @Override
    public List<AdminBannerResponse> getAllBanners() {
        return bannerRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AdminBannerResponse createBanner(
            String title,
            Boolean active,
            MultipartFile imageFile
    ) {
        String imageName = saveBannerImageRequired(imageFile);

        Banner banner = Banner.builder()
                .title(normalizeNullableText(title))
                .image(imageName)
                .active(active != null ? active : true)
                .build();

        return toResponse(bannerRepository.save(banner));
    }

    @Override
    @Transactional
    public AdminBannerResponse updateBanner(
            Long id,
            String title,
            Boolean active,
            MultipartFile imageFile
    ) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy banner"
                ));

        String oldImageName = banner.getImage();
        String newImageName = saveBannerImageOptional(imageFile);

        banner.setTitle(normalizeNullableText(title));

        if (active != null) {
            banner.setActive(active);
        }

        /*
         * Nếu có upload ảnh mới thì đổi sang ảnh mới.
         * Nếu không upload ảnh mới thì giữ nguyên ảnh cũ.
         */
        if (newImageName != null) {
            banner.setImage(newImageName);
        }

        Banner savedBanner = bannerRepository.save(banner);

        /*
         * Chỉ xóa ảnh cũ sau khi DB đã save thành công.
         */
        if (newImageName != null) {
            deleteBannerImage(oldImageName);
        }

        return toResponse(savedBanner);
    }

    @Override
    @Transactional
    public AdminBannerResponse toggleBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy banner"
                ));

        Boolean currentActive = banner.getActive();
        banner.setActive(currentActive == null || !currentActive);

        return toResponse(bannerRepository.save(banner));
    }

    @Override
    @Transactional
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy banner"
                ));

        String oldImageName = banner.getImage();

        bannerRepository.delete(banner);

        deleteBannerImage(oldImageName);
    }

    private String saveBannerImageRequired(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ảnh banner không được để trống"
            );
        }

        return saveBannerImage(imageFile);
    }

    private String saveBannerImageOptional(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            return null;
        }

        return saveBannerImage(imageFile);
    }

    private String saveBannerImage(MultipartFile imageFile) {
        String contentType = imageFile.getContentType();

        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Chỉ cho phép upload ảnh JPG, PNG hoặc WEBP"
            );
        }

        try {
            Files.createDirectories(bannerImageUploadDir);

            String originalFilename = imageFile.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String newFilename = UUID.randomUUID() + extension;

            Path targetPath = bannerImageUploadDir.resolve(newFilename).normalize();

            if (!targetPath.startsWith(bannerImageUploadDir)) {
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
                    "Không thể lưu ảnh banner"
            );
        }
    }

    private void deleteBannerImage(String filename) {
        if (filename == null || filename.isBlank()) {
            return;
        }

        if ("default-banner.jpg".equalsIgnoreCase(filename)) {
            return;
        }

        try {
            Path imagePath = bannerImageUploadDir.resolve(filename).normalize();

            if (!imagePath.startsWith(bannerImageUploadDir)) {
                return;
            }

            Files.deleteIfExists(imagePath);

        } catch (IOException e) {
            System.err.println("Không thể xóa ảnh banner cũ: " + filename);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }

        return filename.substring(filename.lastIndexOf(".")).toLowerCase();
    }

    private AdminBannerResponse toResponse(Banner banner) {
        return AdminBannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .image(banner.getImage())
                .active(banner.getActive())
                .build();
    }

    private String normalizeNullableText(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}