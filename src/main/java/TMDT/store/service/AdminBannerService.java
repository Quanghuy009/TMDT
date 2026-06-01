package TMDT.store.service;

import TMDT.store.dto.request.BannerRequest;
import TMDT.store.dto.response.AdminBannerResponse;

import java.util.List;

public interface AdminBannerService {

    List<AdminBannerResponse> getAllBanners();

    AdminBannerResponse createBanner(BannerRequest request);

    AdminBannerResponse updateBanner(Long id, BannerRequest request);

    AdminBannerResponse toggleBanner(Long id);

    void deleteBanner(Long id);
}