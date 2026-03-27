export async function fetchUserData() {
    try {
        const response = await fetch("/api/user/profile");
        let userData = await response.json();
        if (response.ok) {
            return userData;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function fetchLearningStats() {
    try {
        const response = await fetch("/api/user/learningStats");
        let data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function fetchFavourites() {
    try {
        const response = await fetch("/api/user/favourites");
        let data = await response.json();
        if (response.ok) {
            return data;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

export async function updateUserData(updatedData) {
    const url = `/api/user/update`;
    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            console.log("User updated successfully");
        } else {
            const error = await response.text();
            console.error("Error updating user:", error);
        }
        return response;
    } catch (err) {
        console.error("Network error:", err);
    }
}

export async function updateUsernameAndEmail(updatedData) {
    const url = `/api/user/update-account`;
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    };

    try {
        return await fetch(url, options);
    } catch (err) {
        console.error("Network error:", err);
    }
}

export async function changePassword(newPassword) {
    const url = `/api/user/change-password`;
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({newPassword}),
    };

    try {
        return await fetch(url, options);
    } catch (err) {
        console.error("Network error:", err);
    }
}

export async function deleteUser() {
    let href = "/error";
    try {
        const response = await fetch("/api/user/account", {
            method: "DELETE",
            credentials: "include"
        });
        if (response.ok) {
            href = "/login?deleted";
        } else {
            const error = await response.text();
            console.error("Error deleting user:", error);
        }
    } catch (err) {
        console.error("Network error:", err);
    }
    window.location.href = href;
}