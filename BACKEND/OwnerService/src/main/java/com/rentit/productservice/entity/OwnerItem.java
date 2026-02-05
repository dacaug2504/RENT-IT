package com.rentit.productservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "owner_items")
public class OwnerItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ot_id")
    private int otId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "item_id")
    private int itemId;

    @Column(name = "brand")
    private String brand;

    @Column(name = "description")
    private String description;

    @Column(name = "condition_type")
    private String conditionType;

    @Column(name = "rent_per_day")
    private int rentPerDay;

    @Column(name = "deposit_amt")
    private int depositAmt;

    @Column(name = "status")
    private String status;
    
    @Column(name = "max_rent_days")
    private int maxRentDays;

    // -------- Getters & Setters --------

    

	public int getOtId() {
        return otId;
    }

    public void setOtId(int otId) {
        this.otId = otId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getConditionType() {
        return conditionType;
    }

    public void setConditionType(String conditionType) {
        this.conditionType = conditionType;
    }

    public int getRentPerDay() {
        return rentPerDay;
    }

    public void setRentPerDay(int rentPerDay) {
        this.rentPerDay = rentPerDay;
    }

    public int getDepositAmt() {
        return depositAmt;
    }

    public void setDepositAmt(int depositAmt) {
        this.depositAmt = depositAmt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
    public int getMaxRentDays() {
		return maxRentDays;
	}

	public void setMaxRentDays(int maxRentDays) {
		this.maxRentDays = maxRentDays;
	}
}
