const { CognitoJwtVerifier } = require("aws-jwt-verify");

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_3WH9rFazx",
  tokenUse: "id",
  clientId: "7a9j6r6p53otod3vc31dqfatjm"
});


const generatePolicy = (principalId, effect, resource) => {
  var authReponse = {};
  authReponse.principalId = principalId;
  if (effect && resource) {
    let policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: effect,
          Resource: resource,
          Action: "execute-api:Invoke",
        },
      ],
    };
    authReponse.policyDocument = policyDocument;
  }
  authReponse.context = {
    foo: "bar",
  };
  console.log(JSON.stringify(authReponse));
  return authReponse;
};

exports.handler = async (event, context, callback) => {
  // lambda authorizer code
  var token = event.authorizationToken; // "allow" or "deny"
  console.log(token);
  try {
    // If the token is not valid, an error is thrown:
    payload = await jwtVerifier.verify(token);
    console.log(JSON.stringify(payload));
    callback(null, generatePolicy("user", "Allow", event.methodArn));
  } catch {
    // API Gateway wants this *exact* error message, otherwise it returns 500 instead of 401:
    callback("Error: Invalid token");
  }

  // switch (token) {
  //   case "allow":
  //     callback(null, generatePolicy("user", "Allow", event.methodArn));
  //     break;
  //   case "deny":
  //       callback(null, generatePolicy("user", "Deny", event.methodArn));
  //       break;
  //   default: 
  //       callback("Error: Invalid token");
  // }
};
