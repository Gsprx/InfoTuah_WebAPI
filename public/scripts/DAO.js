class UserDAO {
  constructor() {
    this.users = [];
  }

  // return user if found, else return null
  findUserByUsername(username) {
    let userFound = null;
    this.users.forEach((user) => {
      if (user.username === username) {
        userFound = user;
        return;
      }
    });
    return userFound;
  }

  // validate user
  validateUser(username, password) {
    const user = this.findUserByUsername(username);
    // if user doesn't exist return
    if (user == null) return false;
    // else if the passwords match return true
    else {
      return user.password == password;
    }
  }

  // add user, return true if user was added succesfully, return false if user already exists
  addUser(user) {
    // check that the user doesn't already exist
    if (!this.findUserByUsername(user.username)) {
      this.users.push(user);
      return true;
    }

    return false;
  }
}

module.exports = UserDAO;
