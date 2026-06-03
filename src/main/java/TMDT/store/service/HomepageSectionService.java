package TMDT.store.service;

import TMDT.store.dto.response.HomepageSectionResponse;

import java.util.List;
import java.util.Map;

public interface HomepageSectionService {

    List<HomepageSectionResponse> getAllSections();

    Map<String, Boolean> getSectionStatusMap();

    HomepageSectionResponse toggleSection(String sectionCode);
}