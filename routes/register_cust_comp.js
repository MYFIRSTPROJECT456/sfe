/*exports.login = function(req, res){
req.session.coid="5";
req.session.ecryt_key="904697ab-8e60-11e7-bce2-000d3a1134dd";
res.render('dashboard.ejs');       
};*/
var request = require('request');

exports.register = function(req, res) {
    var message = '';
    var sess = req.session;
    var tenantid = coid;
    if (req.method == "POST") {
        var post = req.body;
        var jsondata = JSON.parse(post.formdata);
        console.log("create customer : ",jsondata);
        precheck(function(err, result) {
            if (err) {
                failed(result);
                return;
            }else if(result.status == '2'){
                var response = JSON.parse(JSON.stringify(result));
                res.send(response);
            }else{
                register(function(err, result) {
                    if (err || result.status == 1 ) {
                        failed(result);
                        return;
                    }
                    getenid(result.custid, function(err, result) {
                        if (err) {
                            failed(result);
                            return;
                        }
                        var response = JSON.parse(JSON.stringify(result));
                        res.send(response);
                    });
                });
            }
        });
    } else {
        var resp = {
            status: "-1",
            status_msg: "Invalid request"
        };
        var response = JSON.parse(JSON.stringify(resp));
        res.send(response);
    }

    function failed(result) {
        var resp = {
            status: result.status,
            status_msg: result.status_msg
        };
        var response = JSON.parse(JSON.stringify(resp));
        res.send(response);
    }

    function register(callback) {
        var pass = jsondata[0]["pwd"];

        if (pass == "") {
            pass = "pass@123";
        }
        console.log("pass of yser", pass);

        var sql1 = "INSERT INTO `tbl_customers` (`coid`, `custname`, `custaddress`, `cp_name`, `cp_email`, `cp_number`, `pwd`) VALUES (?,?,?,?,?,?,?)";

        db.query(sql1, [tenantid, jsondata[0]["custname"], jsondata[0]["custaddress"], jsondata[0]["cp_name"], jsondata[0]["cp_email"], jsondata[0]["cp_number"], pass], function(err, results) {
            console.log("result", err, results);
            if (results) {
                var resp = {
                    status: "0",
                    status_msg: "Success",
                    custid: results.insertId
                };
                var response = JSON.parse(JSON.stringify(resp));
                callback(err, response);
            } else {
                var resp = {
                    status: "1",
                    status_msg: err["sqlMessage"]
                };
                var response = JSON.parse(JSON.stringify(resp));
                callback(err, response);
            }
        });
    }

    function precheck(callback) {
        var sql1 = "SELECT coid, enid, enname, loginid, roleid, mgrid, contact_mobileno, if(photo_url is null or photo_url='', CONCAT('" + url + "','contents/u00.png'), CONCAT('" + url + "',photo_url)) photo FROM `tbl_login` WHERE upper(loginid) = upper(?) and coid = ?";

        // console.log(sql1);
        db.query(sql1, [jsondata[0]["cp_email"], tenantid], function(err, results) {
            var main_result = JSON.parse(JSON.stringify(results));
            console.log("result", err, main_result);

            if (err) {
                var resp = {
                    status: "1",
                    status_msg: err["sqlMessage"]
                };
                var response = JSON.parse(JSON.stringify(resp));
                callback(err, response);
            } else if (main_result && main_result.length > 0) {
                var resp = {
                    status: "2",
                    status_msg: "User Exists with email : " + jsondata[0]["cp_email"]
                };
                callback(new Error("Error"), resp);
            } else {
                var resp = {
                    status: "0",
                    status_msg: "Success"
                };
                callback(err, resp);
            }
        });
    }
    
    function getenid(custid,callback) {
        var sql1 = "SELECT enid FROM `tbl_login` WHERE loginid = (SELECT cp_email FROM tbl_customers WHERE custid = ?)";
        // console.log(sql1);
        db.query(sql1, [custid], function(err, results) {
            var main_result = JSON.parse(JSON.stringify(results));
            console.log("result", err, main_result);
            if (err) {
                var resp = {
                    status: "1",
                    status_msg: err["sqlMessage"]
                };
                var response = JSON.parse(JSON.stringify(resp));
                callback(err, response);
            } else if (main_result && main_result.length > 0) {
                var resp = {
                    status: "0",
                    status_msg: "Success",
                    custid : main_result[0].enid
                };
                callback(err, resp);
            }
        });
    }

}