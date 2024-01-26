# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)





const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=0");
const sheet = sheets.getSheetByName("CONTACT");

const sheets2 = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=157462856");
const sheetB = sheets2.getSheetByName("CABBOOKING");

const sheets3 = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=941997358");
const sheetC = sheets3.getSheetByName("DRIVERCABDETAIL");

function doPost(e) {
  let data = e.parameter;

  // Check if the request is for CONTACT or CABBOOKING
  if (data.hasOwnProperty("NAME")) {
    // Request for CONTACT sheet
    sheet.appendRow([data.NAME, data.EMAIL, data.MESSAGE]);
    return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet CONTACT database!");
  } else if (data.hasOwnProperty("FIRSTNAME")) {
    // Request for CABBOOKING sheet
    sheetB.appendRow([data.FIRSTNAME, data.LASTNAME, data.EMAIL, data.MOBILE, data.FROMADDRESS, data.TOADDRESS, data.PERSON, data.LUGGAGE, data.JOURNEYDATE, data.JOURNEYTIME, data.MESSAGE]);
    return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet CABBOOKING database!");
  }else if (data.hasOwnProperty("DRIVERID")) {
    // Request for CABBOOKING sheet
    sheetC.appendRow([data.DRIVERID, data.CARNUMBER, data.DRIVERNAME, data.EMPLOYEENAME, data.DATE, data.PICKUPLOCATION, data.PICKUPTIME, data.DROPLOCATION, data.DROPTIME, data.OPENINGREADING, data.CLOSINGREADING,data.TOTALRUNKMS,data.EXTRAKMS,data.NIGHTHALTS,data.TOTALDAYS]);
    return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet CABBOOKING database!");
  }
   else {
    // Handle unrecognized request
    return ContentService.createTextOutput("Invalid request");
  }
}

