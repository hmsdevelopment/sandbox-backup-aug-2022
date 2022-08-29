/**
 * @author Jeff McDonald
 */

function setUniqueid()
{
	var id = randomString()
	nlapiSetFieldValue('autoname', 'F')
	nlapiSetFieldValue('entityid', id)
	nlapiSetFieldValue('partnercode', id)
	
	//if ( nlapiGetFieldValue('customform') == 5)
	//	nlapiSetFieldValue('isperson', 'F')
}
			
function randomString() 
{
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 20;
	var randomstring = '';
	for (var i=0; i<string_length; i++) 
	{
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring
}
