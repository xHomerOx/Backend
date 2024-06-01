export const auth = function (req, res, next) {
    const { user, password } = req.body;
    
    if (user === "admincoder@coder.com" && password === "adminCod3r123") {
        req.session.user = user;
        req.session.admin = true;
        const adminUser = {
            user: "admincoder@coder.com",
            role: "admin"
        }

        req.session.user = adminUser;
        return res.redirect("/");
    } else {
        return next();
    }
}