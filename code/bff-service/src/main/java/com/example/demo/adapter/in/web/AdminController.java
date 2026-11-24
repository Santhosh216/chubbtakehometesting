package com.example.demo.adapter.in.web;

import com.example.bff.adapter.in.web.generated.AdminDashboardApi;
import com.example.bff.adapter.in.web.generated.model.ClaimResponseDTO;
import com.example.bff.adapter.in.web.generated.model.ClaimStatusDTO;
import com.example.bff.adapter.in.web.generated.model.DashboardStatsResponseDTO;
import com.example.bff.adapter.in.web.generated.model.UpdateClaimStatusRequestDTO;
import com.example.bff.adapter.in.web.generated.model.UserResponseDTO;
import com.example.bff.adapter.out.claims.ApiException;
import com.example.bff.adapter.out.claims.ApiClient;
import com.example.demo.adapter.out.claims.ClaimsServiceClientFactory;
import com.example.demo.application.auth.ServiceAccountTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class AdminController implements AdminDashboardApi {

    private final ClaimsServiceClientFactory clientFactory;
    private final ServiceAccountTokenProvider serviceAccountTokenProvider;
    private final AdminClaimResponseMapper adminClaimResponseMapper;

    @Autowired
    public AdminController(
            ClaimsServiceClientFactory clientFactory,
            ServiceAccountTokenProvider serviceAccountTokenProvider,
            AdminClaimResponseMapper adminClaimResponseMapper) {
        this.clientFactory = clientFactory;
        this.serviceAccountTokenProvider = serviceAccountTokenProvider;
        this.adminClaimResponseMapper = adminClaimResponseMapper;
    }

    AdminController(String claimsServiceUrl,
                    ServiceAccountTokenProvider serviceAccountTokenProvider,
                    AdminClaimResponseMapper adminClaimResponseMapper) {
        this(new ClaimsServiceClientFactory(new ApiClient().setBasePath(claimsServiceUrl)),
                serviceAccountTokenProvider,
                adminClaimResponseMapper);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsResponseDTO> getDashboardStats(Optional<Boolean> bypassCache) {
        try {
            var client = clientFactory.create(serviceAccountTokenProvider.getServiceAccountToken());
            var claimsResponse = new com.example.bff.adapter.out.claims.generated.DashboardApi(client)
                    .getDashboardStats(bypassCache.orElse(false));
            var response = new DashboardStatsResponseDTO()
                    .totalUsers(claimsResponse.getTotalUsers())
                    .totalClaims(claimsResponse.getTotalClaims())
                    .claimsByStatus(claimsResponse.getClaimsByStatus())
                    .cacheHit(claimsResponse.getCacheHit())
                    .queryTimeMs(claimsResponse.getQueryTimeMs());
            return ResponseEntity.ok(response);
        } catch (ApiException exception) {
            if (exception.getCode() == 403) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            throw new IllegalStateException("Claims Service call failed: " + exception.getMessage(), exception);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> flushDashboardCache() {
        try {
            var client = clientFactory.create(serviceAccountTokenProvider.getServiceAccountToken());
            new com.example.bff.adapter.out.claims.generated.DashboardApi(client).flushDashboardCache();
            return ResponseEntity.noContent().build();
        } catch (ApiException exception) {
            if (exception.getCode() == 403) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            throw new IllegalStateException("Claims Service call failed: " + exception.getMessage(), exception);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> listAllUsers() {
        try {
            var claimsResponse = new com.example.bff.adapter.out.claims.generated.UsersApi(createUserApiClient())
                    .listAllUsers();
            var response = claimsResponse.stream()
                    .map(user -> new UserResponseDTO()
                            .userId(user.getUserId())
                            .email(user.getEmail())
                            .name(user.getName())
                            .role(com.example.bff.adapter.in.web.generated.model.UserRoleDTO.fromValue(user.getRole().getValue()))
                            .createdAt(user.getCreatedAt()))
                    .toList();
            return ResponseEntity.ok(response);
        } catch (ApiException exception) {
            if (exception.getCode() == 403) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            throw new IllegalStateException("Claims Service call failed: " + exception.getMessage(), exception);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClaimResponseDTO>> listAllClaims(Optional<ClaimStatusDTO> status, Optional<UUID> userId) {
        try {
            var client = clientFactory.create(serviceAccountTokenProvider.getServiceAccountToken());
            com.example.bff.adapter.out.claims.generated.model.ClaimStatusDTO claimsStatus =
                    status.map(s -> com.example.bff.adapter.out.claims.generated.model.ClaimStatusDTO.fromValue(s.getValue()))
                            .orElse(null);

            var claimsResponse = new com.example.bff.adapter.out.claims.generated.AdminClaimsApi(client)
                    .listAllClaims(claimsStatus, userId.orElse(null));
            return ResponseEntity.ok(adminClaimResponseMapper.toClaimResponseList(claimsResponse));
        } catch (ApiException exception) {
            if (exception.getCode() == 403) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            throw new IllegalStateException("Claims Service call failed: " + exception.getMessage(), exception);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClaimResponseDTO> updateClaimStatus(UUID claimId, UpdateClaimStatusRequestDTO updateClaimStatusRequestDTO) {
        try {
            var client = createUserApiClient();
            var claimsRequest = new com.example.bff.adapter.out.claims.generated.model.UpdateClaimStatusRequestDTO()
                    .newStatus(com.example.bff.adapter.out.claims.generated.model.ClaimStatusDTO.fromValue(
                            updateClaimStatusRequestDTO.getNewStatus().getValue()));

            var claimsResponse = new com.example.bff.adapter.out.claims.generated.AdminClaimsApi(client)
                    .updateClaimStatus(claimId, claimsRequest);
            return ResponseEntity.ok(adminClaimResponseMapper.toClaimResponse(claimsResponse));
        } catch (ApiException exception) {
            if (exception.getCode() == 400) {
                return ResponseEntity.badRequest().build();
            }
            if (exception.getCode() == 403) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            if (exception.getCode() == 404) {
                return ResponseEntity.notFound().build();
            }
            throw new IllegalStateException("Claims Service call failed: " + exception.getMessage(), exception);
        }
    }

    private ApiClient createUserApiClient() {
        var authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
            return clientFactory.create(jwt.getTokenValue());
        } else {
            throw new IllegalStateException("No user JWT token found in security context");
        }
    }
}
