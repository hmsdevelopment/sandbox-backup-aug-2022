/**
 * @author Midware
 * @Website www.midware.net
 * @developer Roy Cordero
 * @contact contact@midware.net
 */

function encryptPassword(request, response)
{
    if(request.getMethod() == 'POST')
    {
        nlapiLogExecution('DEBUG', 'Running', 'Encrypt password running');

        var pBuilderToken = request.getParameter('randomToken');
        var pBuilderID = request.getParameter('builderID');
        var pHashedPw = request.getParameter('hashedPw');

        var builder = nlapiLoadRecord('partner', Number(pBuilderID));
        var builderToken = builder.getFieldValue('custentity_mw_temp_access_token');

        nlapiLogExecution('DEBUG', 'pHashedPw', pHashedPw);
        nlapiLogExecution('DEBUG', 'pHashedPw Descryp', nlapiDecrypt(pHashedPw, 'base64'));
        nlapiLogExecution('DEBUG', 'pHashedPw Encryp', nlapiEncrypt(nlapiDecrypt(pHashedPw, 'base64'), "aes"));
        nlapiLogExecution('DEBUG', 'custentity_password_hidden', builder.getFieldValue('custentity_password_hidden'));


        if (builderToken === pBuilderToken)
        {
            nlapiLogExecution('DEBUG', 'Running', 'Tokens match!');
            if (nlapiEncrypt(nlapiDecrypt(pHashedPw, 'base64'), "aes") === builder.getFieldValue('custentity_password_hidden'))
            {
                nlapiLogExecution('DEBUG', 'Running', 'Passwords match!');
                response.write('true');
            }
            else
            {
                nlapiLogExecution('DEBUG', 'Running', 'Passwords not match!');
                response.write('false');
            }
        }
        else
        {
            nlapiLogExecution('DEBUG', 'Running', 'Tokens not match!');
            response.write('false');
        }
    }
    else if(request.getMethod() == 'GET'){
        var pHashedPw = request.getParameter('hashedPw');
        response.write(nlapiEncrypt(nlapiDecrypt(pHashedPw, 'base64'), "aes"));
    }
}