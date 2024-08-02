export default {
    or: function(a, b) {
        return a || b;
    },
    and: function(a, b) {
        return a && b;
    },
    eq: function(a, b) {
        return a === b;
    },
    not: function(value) {
        return !value;
    }
};