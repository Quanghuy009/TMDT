package TMDT.store.service;

import TMDT.store.dto.response.DashboardResponse;

import java.time.LocalDate;

public interface DashboardService {

    DashboardResponse getDashboard(String range, LocalDate startDate, LocalDate endDate);
}