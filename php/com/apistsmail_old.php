<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

require_once 'apicalbe.php';
require_once 'apicaldb.php';
require_once 'apiconst.php';
require_once 'mailer/PHPMailerAutoload.php';
require_once 'apicsync.php';

        $coid = 5;
        $custtab = gettxntab($coid,1);
        $tomail ="contact@apicalin.com,yogesh_patni@polyset.net,pankaj.soni@polyset.com,lalit0911@gmail.com";
        $Qry="select username,(select count(*) from ".$custtab." where tbl_users.userid=".$custtab.".userid and tbl_users.coid=".$custtab.".coid and DATE(".$custtab.".date_gen)=DATE(now()))cust_count from tbl_users where userid in (SELECT DISTINCT userid FROM `tbl_cxndetails` WHERE (date(now()-1)) = (date(date_cxn)) and userid > 0) and coid =:p1";
        $params = array($coid);
        $response = executesel($Qry,$params);
        echo (print_r($response,true));
        $mailbody = " Dear Sirs,<br><br> Please find details of the users who have used FieldView - PolySet <br><br> <Table style='border: 1px solid black' ><tr><th>Executive Name</th><th>Added Customers</th></tr>";
         foreach ($response as $row)
                {
                        $usrname        = $row["username"];
                        $cust_count     = $row["cust_count"];
                        $mailbody       =$mailbody."<tr><td style='border: .5px solid black' >".$usrname."</td><td style='border: .5px solid black' >".$cust_count."</td></tr>";
                }
        $mailbody .= "</table><br><br><br>With Regards,<br><br> Apical Support Team";
        echo($mailbody);
        $mresponse =sendmailv1($tomail,$mailbody);
        echo   ($mresponse);



function sendmailv1($tmail,$mbody)
{   
    $mail = new PHPMailer;
    
    $mail->isSMTP(); // Set mailer to use SMTP
    $mail->Host       = P12; // Specify main and backup SMTP servers
    $mail->SMTPAuth   = true; // Enable SMTP authentication
    $mail->Username   = "teamfieldview@gmail.com";// SMTP username
    $mail->Password   = "Mdex@2312"; // SMTP password
    $mail->SMTPSecure = 'tls'; // Enable TLS encryption, `ssl` also accepted
    $mail->Port       = 587; // TCP port to connect to
    
    $mail->setFrom(P13, P15);
    $mail->addReplyTo(P13, P15);
   // $mail->addAddress($tmail);
    
    $addr = explode(',',$tmail);

    foreach ($addr as $ad) {
    $mail->addAddress(trim($ad));       
    }

    $mail->isHTML(true);
    $bodyContent = $mbody;
    $mail->Subject = "FieldView - PolySet Usage Details";
    $mail->Body    = $bodyContent;
    $response = $mail->send();
	echo($response);
    return ($response);
}
?>
