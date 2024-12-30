class UserDAO {
  constructor() {
    this.users = [];
  }

  // return user if found, else return null
  async findUserByUsername(username) {
    this.users.forEach((user) => {
      if (user.username == username) return user;
    });
    return null;
  }

  // validate user
  async validateUser(username, password) {
    const user = this.findUserByUsername(username);
    // if user doesn't exist return
    if (user == null) return false;
    // else if the passwords match return true
    else {
      return user.password == password;
    }
  }

  // add user, return true if user was added succesfully, return false if user already exists
  async addUser(user) {
    // check that the user doesn't already exist
    if (!this.findUserByUsername(user.username)) {
      this.users.push(user);
      return true;
    }

    return false;
  }
}

module.exports = UserDAO;
