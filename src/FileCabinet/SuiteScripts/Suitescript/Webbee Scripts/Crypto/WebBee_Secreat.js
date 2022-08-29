var body = '';
function Secreat(type) 
{
	try
	{
		 var encrypted = CryptoJS.AES.encrypt("7494", "Secret Passphrase");
		//U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=

		var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
		//4d657373616765
		var message = decrypted.toString(CryptoJS.enc.Utf8);
		
		body = 'encrypted : '+encrypted;
		body += ', decrypted : '+decrypted;
		body += ',message : '+message;
		   nlapiLogExecution('DEBUG', 'Body : ', body);
	}
	 catch(ex)
	 {
		  body = 'Secreat, Exception : '+ex+', Message : '+ex.message;
		   nlapiLogExecution('DEBUG', 'Body : ', body);
	 }
}
