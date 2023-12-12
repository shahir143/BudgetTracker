const sib = require("sib-api-v3-sdk");

let defaultClient=sib.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey=process.env.FORGET_API_KEY;

let apiInstance=new sib.TransactionalEmailsApi();

exports.resetPassword = async (req,res)=>{
try{
    const {email}=req.body;

    const sender = new sib.SendSmtpEmailSender();
		sender.email = "hr@recur.com";
		sender.name = "HR";

		const to = [new sib.SendSmtpEmailTo()];
		to[0].email = email;

    const SendSmtpEmail=new sib.SendSmtpEmail();
    SendSmtpEmail.sender=sender;
    SendSmtpEmail.to=to;
    SendSmtpEmail.subject='reset password'
    SendSmtpEmail.textContent=`click the following link to reset`;
    
    const emailResponse=await apiInstance.sendTransacEmail(SendSmtpEmail);
    console.log(emailResponse)
    res.status(200).json({success:true,message:"email send successfully"})
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"failed to send email", error:error});
    }
}