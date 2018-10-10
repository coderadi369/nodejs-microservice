app can be run by

1) npm install
2) npm start

Test can be done by command npm test


use postman for testing api

for auth token the request body  would be of form 

           {
                'username':'anystring',
                'password':'anystring'
           }


for json patch the request would be of form

         req: POST /json-patch {
            header:token
    		body : JSON Object,
    		patch: JSON Patch Object

		}


for image resizer the request would be of form

          {
            header:token
            url:Imageurl
          }



           