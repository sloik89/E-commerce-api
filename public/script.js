const form = document.querySelector(".form");
const password = document.querySelector(".password");
const email = document.querySelector(".email");
const btnTest = document.querySelector(".btn-test");
const logout = document.querySelector(".logout");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(password.value, email.value);
  login();
});
btnTest.addEventListener("click", () => {
  console.log("jestem");
  login(true);
});
logout.addEventListener("click", () => {
  logoutUser();
});
const login = async (test = false) => {
  let user;
  if (test) {
    user = { password: "secret", email: "swba22@gmail.com" };
  } else {
    user = { password: password.value, email: email.value };
  }
  console.log(user);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
const logoutUser = async () => {
  try {
    const res = await fetch("/api/auth/logout");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
