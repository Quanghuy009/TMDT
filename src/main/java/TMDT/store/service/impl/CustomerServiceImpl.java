package TMDT.store.service.impl;

import TMDT.store.dto.response.AdminCustomerResponse;
import TMDT.store.entity.User;
import TMDT.store.repository.UserRepository;
import TMDT.store.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;

    @Override
    public List<AdminCustomerResponse> getAllAdminCustomers() {
        return userRepository.findAllAdminCustomers();
    }

    @Override
    @Transactional
    public AdminCustomerResponse toggleCustomerActive(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        Boolean currentActive = user.getActive();

        user.setActive(currentActive == null || !currentActive);

        userRepository.save(user);

        return userRepository.findAdminCustomerById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng sau khi cập nhật"));
    }
}