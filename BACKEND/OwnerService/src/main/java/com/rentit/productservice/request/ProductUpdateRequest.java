package com.rentit.productservice.request;

import org.springframework.web.multipart.MultipartFile;

public class ProductUpdateRequest {

    private String brand;
    private String description;
    private String conditionType;
    private int rentPerDay;
    private int depositAmt;
    private String status; // AVAILABLE / UNAVAILABLE
    private int maxRentDays;
    private MultipartFile img1;
    private MultipartFile img2;
    private MultipartFile img3;
    private MultipartFile img4;
    private MultipartFile img5;
    

    // -------- Getters & Setters --------

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

	public MultipartFile getImg1() {
		return img1;
	}

	public void setImg1(MultipartFile img1) {
		this.img1 = img1;
	}

	public MultipartFile getImg2() {
		return img2;
	}

	public void setImg2(MultipartFile img2) {
		this.img2 = img2;
	}

	public MultipartFile getImg3() {
		return img3;
	}

	public void setImg3(MultipartFile img3) {
		this.img3 = img3;
	}

	public MultipartFile getImg4() {
		return img4;
	}

	public void setImg4(MultipartFile img4) {
		this.img4 = img4;
	}

	public MultipartFile getImg5() {
		return img5;
	}

	public void setImg5(MultipartFile img5) {
		this.img5 = img5;
	}

	public int getMaxRentDays() {
		return maxRentDays;
	}

	public void setMaxRentDays(int maxRentDays) {
		this.maxRentDays = maxRentDays;
	}
}
