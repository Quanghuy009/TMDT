package TMDT.store.service.impl;

import TMDT.store.dto.request.BannerRequest;
import TMDT.store.dto.response.AdminBannerResponse;
import TMDT.store.entity.Banner;
import TMDT.store.repository.BannerRepository;
import TMDT.store.service.AdminBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminBannerServiceImpl implements AdminBannerService {

    private final BannerRepository bannerRepository;

    @Override
    public List<AdminBannerResponse> getAllBanners() {
        return bannerRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AdminBannerResponse createBanner(BannerRequest request) {
        validateBannerRequest(request);

        Banner banner = Banner.builder()
                .title(normalizeNullableText(request.getTitle()))
                .image(request.getImage().trim())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return toResponse(bannerRepository.save(banner));
    }

    @Override
    @Transactional
    public AdminBannerResponse updateBanner(Long id, BannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy banner"));

        validateBannerRequest(request);

        banner.setTitle(normalizeNullableText(request.getTitle()));
        banner.setImage(request.getImage().trim());

        if (request.getActive() != null) {
            banner.setActive(request.getActive());
        }

        return toResponse(bannerRepository.save(banner));
    }

    @Override
    @Transactional
    public AdminBannerResponse toggleBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy banner"));

        Boolean currentActive = banner.getActive();
        banner.setActive(currentActive == null || !currentActive);

        return toResponse(bannerRepository.save(banner));
    }

    @Override
    @Transactional
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy banner"));

        bannerRepository.delete(banner);
    }

    private AdminBannerResponse toResponse(Banner banner) {
        return AdminBannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .image(banner.getImage())
                .active(banner.getActive())
                .build();
    }

    private void validateBannerRequest(BannerRequest request) {
        if (request == null) {
            throw new RuntimeException("Dữ liệu banner không hợp lệ");
        }

        if (request.getImage() == null || request.getImage().trim().isEmpty()) {
            throw new RuntimeException("Ảnh banner không được để trống");
        }
    }

    private String normalizeNullableText(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}