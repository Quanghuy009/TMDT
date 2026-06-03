package TMDT.store.service.impl;

import TMDT.store.dto.response.HomepageSectionResponse;
import TMDT.store.entity.HomepageSection;
import TMDT.store.repository.HomepageSectionRepository;
import TMDT.store.service.HomepageSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HomepageSectionServiceImpl implements HomepageSectionService {

    private final HomepageSectionRepository homepageSectionRepository;

    @Override
    public List<HomepageSectionResponse> getAllSections() {
        return homepageSectionRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public Map<String, Boolean> getSectionStatusMap() {
        List<HomepageSection> sections = homepageSectionRepository.findAllByOrderByIdAsc();

        Map<String, Boolean> result = new LinkedHashMap<>();

        for (HomepageSection section : sections) {
            result.put(section.getCode(), Boolean.TRUE.equals(section.getActive()));
        }

        return result;
    }

    @Override
    @Transactional
    public HomepageSectionResponse toggleSection(String sectionCode) {
        HomepageSection section = homepageSectionRepository.findByCode(sectionCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy section: " + sectionCode));

        section.setActive(!Boolean.TRUE.equals(section.getActive()));

        return toResponse(homepageSectionRepository.save(section));
    }

    private HomepageSectionResponse toResponse(HomepageSection section) {
        return HomepageSectionResponse.builder()
                .id(section.getId())
                .code(section.getCode())
                .name(section.getName())
                .active(section.getActive())
                .build();
    }
}