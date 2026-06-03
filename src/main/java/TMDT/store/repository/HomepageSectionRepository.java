package TMDT.store.repository;

import TMDT.store.entity.HomepageSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HomepageSectionRepository extends JpaRepository<HomepageSection, Long> {

    List<HomepageSection> findAllByOrderByIdAsc();

    Optional<HomepageSection> findByCode(String code);
}