import {fetchUserData} from "../api/userApi.js";

export async function loadAuthNav(user) {
    if (!user) {
        user = await fetchUserData();
    }
    if (user !== null) {
        document.getElementById("account").innerHTML = `
                        <a href="/logout" class="signup">logout</a>
                        <a href="/profile"><img src="${user.profilePicture ?? '/images/girl1.jpg'}"></a>
                `;
    } else {
        document.getElementById("account").innerHTML = `
                       <a href="/signup" class="signup">sign up</a>
                       <a href="/login" class="login">login</a>
                 `;
    }
}

