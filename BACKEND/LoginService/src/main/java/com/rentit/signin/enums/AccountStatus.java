package com.rentit.signin.enums;

public enum AccountStatus {
    INACTIVE(0),
    ACTIVE(1),
    BLOCKED(2);

    private final int value;

    AccountStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
