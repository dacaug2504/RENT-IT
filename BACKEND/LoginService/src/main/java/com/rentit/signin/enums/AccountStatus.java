package com.rentit.signin.enums;

public enum AccountStatus {
    INACTIVE(-1),
    BLOCKED(0),
    ACTIVE(1);

    private final int value;

    AccountStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
