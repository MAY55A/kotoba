package com.may55a.kotoba.models;

public enum UserRole {
    USER,
    ADMIN;

    @Override
    public String toString() {
        return name();
    }
}
