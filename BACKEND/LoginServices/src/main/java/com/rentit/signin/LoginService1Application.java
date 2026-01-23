package com.rentit.signin;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
	    "com.rentit.login",
	    "com.rentit.login.controllers",
	    "com.rentit.login.services"
	})
public class LoginService1Application {

	public static void main(String[] args) {
		SpringApplication.run(LoginService1Application.class, args);
	}

}
