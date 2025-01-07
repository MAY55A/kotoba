async function fetchUserData() {
    try {
        const response = await fetch("/api/user/profile");
        userData = await response.json();
        if (response.ok) {
            return userData;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

async function updateUserData(updatedData) {
    const url = `/api/user/update`;
    const options = {
        method: "PUT",
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
    } catch (err) {
        console.error("Network error:", err);
    }
}