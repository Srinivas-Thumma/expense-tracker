package com.expensetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
//. When someone requests /profile-pictures/abc123.jpg, Spring serves the actual file from the uploads/ folder on disk. This is how profile pictures get loaded in the browser without a dedicated controller endpoint.
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/profile-pictures/**")
                .addResourceLocations("file:uploads/");
    }
}