document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("github-form");
    const input = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = input.value;
        const url = `https://api.github.com/search/users?q=${username}`;
        getUsers(url);
    });

    async function getUsers(url) {
        try {
            const response = await fetch(url, {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                const users = data.items;

                userList.innerHTML = "";

                users.forEach((user) => {
                    const userDiv = document.createElement("div");
                    userDiv.innerHTML = `
                        <div>
                            <img src="${user.avatar_url}" alt="${user.login}" width="100">
                            <p><strong>${user.login}</strong></p>
                            <a href="${user.html_url}" target="_blank">View Profile</a>
                            <button class="repos-button" data-username="${user.login}">Show Repos</button>
                        </div>
                    `;
                    userList.appendChild(userDiv);

                    const showReposButton = userDiv.querySelector(".repos-button");
                    showReposButton.addEventListener("click", function () {
                        const username = this.getAttribute("data-username");
                        getRepositories(username);
                    });
                });
            } else {
                console.error("Failed to fetch data.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function getRepositories(username) {
        try {
            const reposUrl = `https://api.github.com/users/${username}/repos`;
            const response = await fetch(reposUrl);

            if (response.ok) {
                const repositories = await response.json();

                repoList.innerHTML = "";

                repositories.forEach((repo) => {
                    const repoDiv = document.createElement("div");
                    repoDiv.innerHTML = `
                        <div>
                            <p><strong>${repo.name}</strong></p>
                            <p>${repo.description}</p>
                            <a href="${repo.html_url}" target="_blank">View Repository</a>
                        </div>
                    `;
                    repoList.appendChild(repoDiv);
                });
            } else {
                console.error("Failed to fetch repository data.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
});
