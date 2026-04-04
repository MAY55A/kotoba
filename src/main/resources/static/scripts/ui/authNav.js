import {fetchUserData} from "../api/userApi.js";

export async function loadAuthNav(user) {
    if (!user) {
        user = await fetchUserData();
    }
    if (user !== null) {
        document.getElementById("account").innerHTML = `
                        <a href="/logout" class="signup">logout</a>
                        <a href="/profile" title="profile"><img src="${user.profilePicture ?? '/images/avatars/default_avatar.png'}"></a>
                `;
    } else {
        document.getElementById("account").innerHTML = `
                       <a href="/signup" class="signup">sign up</a>
                       <a href="/login" class="login">login</a>
                 `;
    }
}

