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

exports.handler = (event, context, callback) => {
  // lambda authorizer code
  var token = event.authorizationToken; // "allow" or "deny"
  switch (token) {
    case "allow":
      callback(null, generatePolicy("user", "Allow", event.methodArn));
      break;
    case "deny":
        callback(null, generatePolicy("user", "Deny", event.methodArn));
        break;
    default: 
        callback("Error: Invalid token");
  }
};
