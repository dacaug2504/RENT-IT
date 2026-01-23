package com.example.demo.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="user")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer user_id;
	
//	private Integer role_id;
	
	private String first_name;
	
	private String last_name;
	
	private String password;
	
	private String email;
	
	private Long phone_no;
	
	private String address;
	
	private Integer state_id;
	
	private Integer city_id;
	
	private Status status;
	
	private LocalDateTime date_time;
	
	@ManyToOne
	@JoinColumn(name = "role_id")
	@JsonIgnoreProperties("users")
	Role role;
}
