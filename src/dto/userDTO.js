class UserDto {
    constructor(user) {
      this.id = user._id;
      this.user = user.user;
      this.email = user.email;
      this.role = role;
      this.cart = cart;
    }
}

export default UserDto;