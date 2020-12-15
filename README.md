### JAFBLOG

A Rest API for blogs built with Node/Express and MongoDB.

#### Installation

1. Clone project
   `git clone https://github.com/mjabubakar/jafblog`
2. cd into folder
   `cd ./jafblog/`
3. Download dependencies
   `npm install`

#### Usage

Start server from your root folder using `npm start`

#### Environmental Variables

-   `URI` MongoDB Compass connection string
-   `PORT` determines which port the server is listening on
-   `TOKEN_DURATION` JWT token duration
-   `ACCESS_TOKEN_SECRET` JWT encryption secret for user login.on.
-   `GCLOUD_PROJECT_ID` Google cloud project id
-   `GCLOUD_FILE_PATH` key.json path
-   `GCLOUD_CRED` All the object inside key.json file
-   `GCLOUD_STORAGE_BUCKET_URL` Storage bucket url
-   `FRONTEND_URL` Url that CORS should accept
