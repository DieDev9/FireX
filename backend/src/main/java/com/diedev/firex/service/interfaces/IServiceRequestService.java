package com.diedev.firex.service.interfaces;

import com.diedev.firex.dto.request.ServiceRequestRequest;
import com.diedev.firex.dto.request.UpdateStatusRequest;
import com.diedev.firex.dto.response.ServiceRequestResponse;

import java.util.List;

public interface IServiceRequestService {
    ServiceRequestResponse createRequest(String userId, String userEmail, ServiceRequestRequest request);
    ServiceRequestResponse getRequestById(String id);
    ServiceRequestResponse getRequestByRequestId(String requestId);
    List<ServiceRequestResponse> getRequestsByUserEmail(String userEmail);
    List<ServiceRequestResponse> getAllRequests();
    List<ServiceRequestResponse> getRequestsByStatus(String status);
    ServiceRequestResponse updateStatus(String id, String updatedBy, UpdateStatusRequest request);
    void deleteRequest(String id);
    long countByStatus(String status);
}
