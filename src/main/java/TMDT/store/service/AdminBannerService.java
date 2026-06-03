package TMDT.store.service;

import TMDT.store.dto.response.AdminBannerResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminBannerService {

    List<AdminBannerResponse> getAllBanners();

    AdminBannerResponse createBanner(
            String title,
            Boolean active,
            MultipartFile imageFile
    );

    AdminBannerResponse updateBanner(
            Long id,
            String title,
            Boolean active,
            MultipartFile imageFile
    );

    AdminBannerResponse toggleBanner(Long id);

    void deleteBanner(Long id);
}