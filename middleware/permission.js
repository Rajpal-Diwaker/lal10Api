const permission = (roles) => {
    return function (req, res, next) {
        var returnV = false;
        for (var i of roles) {
            if (req.user.role == i) {
                returnV = true;
                break;
            }
        }
        returnV ? next() : res.status(401).send({
            code: 401, message: "permission not allowed"
        })
    }
}

module.exports = permission;