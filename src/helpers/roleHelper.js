export default {
    isAdmin: function(user) {
      return user && user.role === 'admin';
    },
    isPremium: function(user) {
        return user && user.role === 'premium';
    },
    or: function(a, b) {
        return a || b;
    }
};