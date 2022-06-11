module.exports = {
    ensureAuthenticated : function(req,res,next) {
        if(!req.cookies.values) {
            res.redirect('/login');
        }
        if(req.cookies.values.signedin === false) {
            res.redirect('/login');
        }
        if(req.cookies.values.signedin === true) {
            return next();
        }
        res.redirect('/login');
    }
}