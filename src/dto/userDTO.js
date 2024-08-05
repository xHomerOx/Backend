class UserDto {
    constructor(user) {
      this.id = user._id;
      this.user = user.user;
      this.email = user.email;
      this.role = user.role;
      this.cart = user.cart;
    }
}

export default UserDto;