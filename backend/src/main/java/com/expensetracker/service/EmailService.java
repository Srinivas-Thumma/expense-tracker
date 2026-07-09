package com.expensetracker.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBudgetExceededEmail(String to, String budgetType) {

        System.out.println("EmailService called");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("japanmail0000@gmail.com");
            message.setTo(to);
            message.setSubject("Budget Alert");
            message.setText("Your budget has been exceeded for " + budgetType);

            mailSender.send(message);

            System.out.println("Email sent successfully");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}