$(document).ready(async function () {
  try {
    const navBar_container = $("#navBar-container");
    const navBarComponent = await navBarGenerator();
    navBar_container.append(navBarComponent);

    const checkSessionResponse = await checkSession();

    if (!checkSessionResponse || checkSessionResponse.role !== "admin") {
      showMessage("You do not have permission to access this page", "error");
      return setTimeout(() => {
        window.location.href = "http://localhost:9000/articles";
      }, 1000);
    }

    const logout_anchor = $("#logout-anchor");
    const userTableBody = $("#userTableBody");
    const paginationUl = $("#paginationUl");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //get pagenumber form query string
    let page = urlParams.get("page");
    if (!page) page = 1;

    //get limit number from query string
    let limit = urlParams.get("limit");
    if (!limit) limit = 3;

    //request to server and get list of users
    const response = await fetch(
      `http://localhost:9000/api/users?page=${page}`
    );
    const data = await response.json();
    const total = data.total;
    const pages = data.pages;
    const usersList = data.data;
    console.log(usersList);

    for (let i = 0; i < pages; i++) {
      if (i + 1 == page) {
        paginationUl.append(
          `<li  class="page-item"><a class="page-link active" href="http://localhost:9000/admin?page=${
            i + 1
          }">${i + 1}</a></li>`
        );
      } else {
        paginationUl.append(
          `<li  class="page-item"><a class="page-link" href="http://localhost:9000/admin?page=${
            i + 1
          }">${i + 1}</a></li>`
        );
      }
    }

    //render
    $.each(usersList, function (index, user) {
      const row = $("<tr></tr>");
      row.append(
        `<td><img style="width:50px; height:50px" src="${user.avatar}" alt="Profile Picture"></td>`
      );
      row.append("<td>" + user.firstName + "</td>");
      row.append("<td>" + user.lastName + "</td>");
      row.append("<td>" + user.username + "</td>");
      row.append("<td>" + user.gender + "</td>");
      row.append("<td>" + user.phone_number + "</td>");
      row.append(`<td>
        <button onclick="requestToDeleteUser('${user._id}')" class="btn btn-outline-danger my-2 my-sm-0" type="submit">
          Delete User
        </button>
      </td>`);

      userTableBody.append(row);
    });

    //search button handling
    const search_input = $("#search_input");

    const search_btn = $("#search_btn");

    search_btn.on("click", async (e) => {
      e.preventDefault();
      const searchInputText = search_input.val().trim();
      window.location.href = `http://localhost:9000?search=${searchInputText}`;
    });

    //loguout handling
    logout_anchor.on("click", async (e) => {
      e.preventDefault();
      const responseObject = await fetch(
        "http://localhost:9000/api/auth/logout"
      );
      const response = await responseObject.json();
      if (responseObject.status === 200) {
        showMessage(response.message, "success");
        setTimeout(() => {
          window.location.href = "http://localhost:9000/login";
        }, 1000);
      } else {
        showMessage(response.message, "error");
      }
    });
  } catch (error) {
    console.error(error);
  }
});

async function requestToDeleteUser(uid) {
  const responseObject = await fetch(`http://localhost:9000/api/users/${uid}`, {
    method: "DELETE",
  });
  const response = await responseObject.json();
  if (responseObject.status === 200) {
    showMessage(response.message, "success");
    window.location.reload();
  } else {
    showMessage(response.message, "error");
  }
}
