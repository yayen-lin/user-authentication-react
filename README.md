## User (token-based) authentication using React, Node.js, MySQL
This application is a simple login/signup/logout practice, and to familiarize myself using kanban board. Feel free to clone this repo and develop it for any further use.

### Motivation
After having an experience working as a team and as a frontend developer, I wanted to understand how backend works and how frontend communicates with the backend. As a result, I made this login system as a practice to get a sense of what it is like working on the backend side.

### Design Detail
Frontend is built using React library and the backend is driven by Node.js, utilizing express framework and a MySQL database.

#### Difficulties
1. Security issue versus users staying logged in.
  - Problem: users are logged out after a page refresh.
  - Design choice: 
    1. Storing user cookies (contained JWT and other user information) in a local or session storage.
      - This can prevent csrf attack but is prone to xss attack according to [this stackoverflow post](https://stackoverflow.com/questions/27067251/where-to-store-jwt-in-browser-how-to-protect-against-csrf) and detail is stated in [this answer](https://stackoverflow.com/a/65956741/13007073) from the same post. 
    2. **I chose to store user cookies in Cookie Storage** and refresh the token every 30 seconds to prevent token being stolen as well as for users to stay logged in.
