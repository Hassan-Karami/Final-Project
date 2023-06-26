//check session

async function navBarGenerator(){
    const isLoggedIn = await checkSession();
    if(!isLoggedIn) {
        return `
        <nav class="navbar navbar-expand-lg navbar-light bg-light p-3">
      <a class="navbar-brand" href="http://localhost:9000">Explore</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a
              id="login-anchor"
              class="nav-link"
              href="http://localhost:9000/login"
              >Login</a
            >
          </li>

          <li class="nav-item">
            <a
              id="signup-anchor"
              class="nav-link"
              href="http://localhost:9000/signup"
              >Signup</a
            >
          </li>
       
        </ul>
      </div>
      <form class="d-flex align-items-center">
        <input
          id="search_input"
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button
          id="search_btn"
          class="btn btn-outline-success my-2 my-sm-0"
          type="submit"
        >
          Search
        </button>
      </form>
   
    </nav>
        `;
    }

    else if(!!isLoggedIn && isLoggedIn.role === "blogger"){
        return `
        <nav class="navbar navbar-expand-lg navbar-light bg-light p-3">
      <a class="navbar-brand" href="http://localhost:9000">Explore</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a
              id="logout-anchor"
              class="nav-link"
              href="#"
              >Logout</a
            >
          </li>

          <li class="nav-item">
            <a
              id="editInfo-anchor"
              class="nav-link"
              href="http://localhost:9000/dashboard"
              >Edit Info</a
            >
          </li>

          <li class="nav-item">
            <a
              id="createArticle-anchor"
              class="nav-link"
              href="http://localhost:9000/create_article"
              >Create Article</a
            >
          </li>

          <li class="nav-item">
            <a
              id="myArticles-anchor"
              class="nav-link"
              href="http://localhost:9000/my_articles"
              >My Articles</a
            >
          </li>
       
        </ul>
      </div>
      <form class="d-flex align-items-center">
        <input
          id="search_input"
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button
          id="search_btn"
          class="btn btn-outline-success my-2 my-sm-0"
          type="submit"
        >
          Search
        </button>
      </form>

      <div class="overflow-hidden d-flex justify-content-center align-items-center ms-3" style="width: 50px; height: 50px; border-radius: 50%; background-color: lightgray;">
  <img src="${isLoggedIn.avatar}" class="img-fluid " alt="Your Image" style="width: 100%;height: 100%;">
</div>
</nav>

        `;
    }

    else{
        return `
        <nav class="navbar navbar-expand-lg navbar-light bg-light p-3">
      <a class="navbar-brand" href="http://localhost:9000">Articles</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a
              id="logout-anchor"
              class="nav-link"
              href="#"
              >Logout</a
            >
          </li>

           <li class="nav-item">
            <a
              id="usersList-anchor"
              class="nav-link"
              href="http://localhost:9000/admin"
              >Users</a
            >
          </li>

          <li class="nav-item">
            <a
              id="editInfo-anchor"
              class="nav-link"
              href="http://localhost:9000/dashboard"
              >Edit Info</a
            >
          </li>

          <li class="nav-item">
            <a
              id="createArticle-anchor"
              class="nav-link"
              href="http://localhost:9000/create_article"
              >Create Article</a
            >
          </li>

          <li class="nav-item">
            <a
              id="myArticles-anchor"
              class="nav-link"
              href="http://localhost:9000/my_articles"
              >My Articles</a
            >
          </li>
       
        </ul>
      </div>
      <form class="d-flex align-items-center">
        <input
          id="search_input"
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button
          id="search_btn"
          class="btn btn-outline-success my-2 my-sm-0"
          type="submit"
        >
          Search
        </button>
      </form>

      <div class="d-flex justify-content-center align-items-center ms-3" style="width: 50px; height: 50px; border-radius: 50%; background-color: lightgray;">
  <img src="${isLoggedIn.avatar}" class="img-fluid rounded-circle" alt="Your Image" style="width: 100%; height: 100%;">
</div>
</nav>
     
        `;
    }
}





