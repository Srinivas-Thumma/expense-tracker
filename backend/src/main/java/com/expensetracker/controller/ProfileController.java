package com.expensetracker.controller;

import com.expensetracker.dto.AppDtos.ProfileRequest;
import com.expensetracker.dto.AppDtos.ProfileResponse;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserService userService;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
private String uploadDir;

    public ProfileController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ProfileResponse get(Authentication authentication) {
        return toResponse(userService.currentUser(authentication));
    }

    @PutMapping
    public ProfileResponse update(@RequestBody ProfileRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setProfilePicture(request.profilePicture());
        user.setUpdatedAt(LocalDateTime.now());
        return toResponse(userRepository.save(user));
    }

    @PostMapping(
        value = "/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ProfileResponse uploadProfilePicture(
        Authentication authentication,
      @RequestParam("file")  MultipartFile file
) throws IOException {

    User user = userService.currentUser(authentication);

    String extension = file.getOriginalFilename()
            .substring(file.getOriginalFilename().lastIndexOf("."));

    String filename = UUID.randomUUID() + extension;

    Path path = Paths.get(uploadDir);

    if (!Files.exists(path)) {
        Files.createDirectories(path);
    }

    Files.copy(
            file.getInputStream(),
            path.resolve(filename),
            StandardCopyOption.REPLACE_EXISTING
    );

    user.setProfilePicture("/profile-pictures/" + filename);

    userRepository.save(user);

    return toResponse(user);
}


    private ProfileResponse toResponse(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getProfilePicture(),
                user.getRole().name()
        );
    }
}


