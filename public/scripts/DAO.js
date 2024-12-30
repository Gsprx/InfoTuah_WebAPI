class UserDAO {
  constructor() {
    this.users = [];
  }

  // return user if found, else return null
  findUserByUsername(username) {
    this.users.forEach((user) => {
      if (user.username == username) return user;
    });
    return null;
  }

  validateUser(username, password) {
    const user = this.findUserByUsername(username);
    // if user doesn't exist return
    if (user == null) return false;
    // else if the passwords match return true
    else {
      return user.password == password;
    }
  }
}
