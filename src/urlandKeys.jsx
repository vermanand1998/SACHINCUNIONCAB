export const googleSheetUrl =
  "https://script.google.com/macros/s/AKfycbxLyjkqwIonoXNtD4u95agNA4uhIaLvdT0HUg2MlY5Tig5Bym9OVfSt_Z_ZUsbat2UF/exec";

// ========================================================================
// GOOGLE APPS SCRIPT CODE - COPY THIS TO YOUR GOOGLE APPS SCRIPT EDITOR
// ========================================================================
// 

// function doPost(e) {
//   var sheetA = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CONTACT");
//   var sheetB = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CABBOOKING");
//   var sheetC = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DRIVERCABDETAIL");
//   var sheetD = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FEEDBACKDETAILS");
//
//   let data = e.parameter;
//
//   // Check which type of data is being sent
//   if (data.hasOwnProperty("NAME")) {
//     // Request for CONTACT sheet
//     sheetA.appendRow([data.NAME, data.EMAIL, data.MESSAGE]);
//     return ContentService.createTextOutput("Your message was successfully sent to the CONTACT database!");
//   
//   } else if (data.hasOwnProperty("FIRSTNAME")) {
//     // Request for CABBOOKING sheet
//     sheetB.appendRow([
//       data.FIRSTNAME,
//       data.LASTNAME,
//       data.EMAIL,
//       data.MOBILE,
//       data.FROMADDRESS,
//       data.TOADDRESS,
//       data.PERSON,
//       data.LUGGAGE,
//       data.JOURNEYDATE,
//       data.JOURNEYTIME,
//       data.MESSAGE
//     ]);
//     return ContentService.createTextOutput("Your message was successfully sent to the CABBOOKING database!");
//   
//   } else if (data.hasOwnProperty("TRIPID")) {
//     // Request for DRIVERCABDETAIL sheet (22 columns matching your spreadsheet)
//     sheetC.appendRow([
//       data.DATE,
//       data.TRIPID,
//       data.CABNO,
//       data.VENDORNAME,
//       data.DRIVERNAME,
//       data.DRIVERMOBILE,
//       data.ESCORTNAME,
//       data.ESCORTIDMOBILE,
//       data.EMPLOYEENAME,
//       data.EMPID,
//       data.TRIPTYPE,
//       data.PICKUPLOCATION,
//       data.PICKUPTIME,
//       data.PICKUPMETERREADING,
//       data.DROPOFFLOCATION,
//       data.DROPOFFTIME,
//       data.DROPOFFMETERREADING,
//       data.TOTALKM,
//       data.SHIFTTIMING,
//       data.GPSENABLED,
//       data.DELAY,
//       data.REMARKS
//     ]);
//     return ContentService.createTextOutput("Your message was successfully sent to the DRIVERCABDETAIL database!");
//   
//   } else if (data.hasOwnProperty("SUGGESTIONS")) {
//     // Request for FEEDBACKDETAILS sheet
//     sheetD.appendRow([
//       data.CUSTOMERNAME,
//       data.DRIVERNAME,
//       data.DATETIMERIDE,
//       data.BOOKNUMBER,
//       data.DRIVERBEHAVIOR,
//       data.SAFTY,
//       data.PUNCTUALITY,
//       data.SUGGESTIONS,
//       data.AGAINDRIVE
//     ]);
//     return ContentService.createTextOutput("Your message was successfully sent to the FEEDBACKDETAILS database!");
//   
//   } else {
//     // Handle unrecognized request
//     return ContentService.createTextOutput("Invalid request");
//   }
// }
//
// ========================================================================
// END OF GOOGLE APPS SCRIPT CODE
// ========================================================================

// OLD REFERENCES (for backup)
// const sheets = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=0");
// const sheet = sheets.getSheetByName("CONTACT");

// const sheets2 = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=157462856");
// const sheetB = sheets2.getSheetByName("CABBOOKING");

// const sheets3 = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=941997358");
// const sheetC = sheets3.getSheetByName("DRIVERCABDETAIL");

// const sheets4 = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=917062512");
// const sheetD = sheets4.getSheetByName("FEEDBACKDETAILS");

// function doPost(e) {
//   let data = e.parameter;

//   // Check if the request is for CONTACT or CABBOOKING
//   if (data.hasOwnProperty("NAME")) {
//     // Request for CONTACT sheet
//     sheet.appendRow([data.NAME, data.EMAIL, data.MESSAGE]);
//     return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet CONTACT database!");
//   } else if (data.hasOwnProperty("FIRSTNAME")) {
//     // Request for CABBOOKING sheet
//     sheetB.appendRow([data.FIRSTNAME, data.LASTNAME, data.EMAIL, data.MOBILE, data.FROMADDRESS, data.TOADDRESS, data.PERSON, data.LUGGAGE, data.JOURNEYDATE, data.JOURNEYTIME, data.MESSAGE]);
//     return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet CABBOOKING database!");
//   }else if (data.hasOwnProperty("DRIVERID")) {
//     // Request for CABBOOKING sheet
//     sheetC.appendRow([data.DRIVERID, data.CARNUMBER, data.DRIVERNAME, data.EMPLOYEENAME, data.DATE, data.PICKUPLOCATION, data.PICKUPTIME, data.DROPLOCATION, data.DROPTIME, data.OPENINGREADING, data.CLOSINGREADING,data.TOTALRUNKMS,data.EXTRAKMS,data.NIGHTHALTS,data.TOTALDAYS]);
//     return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet CABBOOKING database!");
//   }else if (data.hasOwnProperty("SUGGESTIONS")) {
//     // Request for CABBOOKING sheet
//     sheetD.appendRow([data.CUSTOMERNAME, data.DRIVERNAME, data.DATETIMERIDE, data.BOOKNUMBER, data.DRIVERBEHAVIOR, data.SAFTY, data.PUNCTUALITY, data.SUGGESTIONS, data.AGAINDRIVE]);
//     return ContentService.createTextOutput("Your message was successfully sent to the Googlesheet CABBOOKING database!");
//   }
//    else {
//     // Handle unrecognized request
//     return ContentService.createTextOutput("Invalid request");
//   }
// }

// function doGet(req){
//     var doc =SpreadsheetApp.getActiveSpreadsheet();
//     var sheet = doc.getSheetByName('CONTACT');
//     var values = sheet.getDataRange().getValues();

//     var outPut=[];
//     for(var i=0;i<values.length;i++)
//   {
//       var row={};
//       row['NAME']=values[i][0];
//       row['EMAIL']=values[i][1];
//       row['MESSAGE']=values[i][2];
//       outPut.push(row);
//   }

//   return ContentService.createTextOutput(JSON.stringify({data:outPut})).setMimeType(ContentService.MimeType.JSON);
//   }

// const sheets = SpreadsheetApp.openByUrl(
//   "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=0"
// );
// const sheet = sheets.getSheetByName("CONTACT");

// const sheets2 = SpreadsheetApp.openByUrl(
//   "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=157462856"
// );
// const sheetB = sheets2.getSheetByName("CABBOOKING");

// const sheets3 = SpreadsheetApp.openByUrl(
//   "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=941997358"
// );
// const sheetC = sheets3.getSheetByName("DRIVERCABDETAIL");

// const sheets4 = SpreadsheetApp.openByUrl(
//   "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=917062512"
// );
// const sheetD = sheets4.getSheetByName("FEEDBACKDETAILS");

// function doPost(e) {
//   var requestData = JSON.parse(e.postData.getDataAsString());
//   var keyValue = requestData.key;
//   if (!keyValue) {
//     let data = e.parameter;

//     // Check if the request is for CONTACT or CABBOOKING
//     if (data.hasOwnProperty("NAME")) {
//       // Request for CONTACT sheet
//       sheet.appendRow([data.NAME, data.EMAIL, data.MESSAGE]);
//       return ContentService.createTextOutput(
//         "Your message was successfully sent to the Googlesheet CONTACT database!"
//       );
//     } else if (data.hasOwnProperty("FIRSTNAME")) {
//       // Request for CABBOOKING sheet
//       sheetB.appendRow([
//         data.FIRSTNAME,
//         data.LASTNAME,
//         data.EMAIL,
//         data.MOBILE,
//         data.FROMADDRESS,
//         data.TOADDRESS,
//         data.PERSON,
//         data.LUGGAGE,
//         data.JOURNEYDATE,
//         data.JOURNEYTIME,
//         data.MESSAGE,
//       ]);
//       return ContentService.createTextOutput(
//         "Your message was successfully sent to the Googlesheet CABBOOKING database!"
//       );
//     } else if (data.hasOwnProperty("DRIVERID")) {
//       // Request for CABBOOKING sheet
//       sheetC.appendRow([
//         data.DRIVERID,
//         data.CARNUMBER,
//         data.DRIVERNAME,
//         data.EMPLOYEENAME,
//         data.DATE,
//         data.PICKUPLOCATION,
//         data.PICKUPTIME,
//         data.DROPLOCATION,
//         data.DROPTIME,
//         data.OPENINGREADING,
//         data.CLOSINGREADING,
//         data.TOTALRUNKMS,
//         data.EXTRAKMS,
//         data.NIGHTHALTS,
//         data.TOTALDAYS,
//       ]);
//       return ContentService.createTextOutput(
//         "Your message was successfully sent to the Googlesheet CABBOOKING database!"
//       );
//     } else if (data.hasOwnProperty("SUGGESTIONS")) {
//       // Request for CABBOOKING sheet
//       sheetD.appendRow([
//         data.CUSTOMERNAME,
//         data.DRIVERNAME,
//         data.DATETIMERIDE,
//         data.BOOKNUMBER,
//         data.DRIVERBEHAVIOR,
//         data.SAFTY,
//         data.PUNCTUALITY,
//         data.SUGGESTIONS,
//         data.AGAINDRIVE,
//       ]);
//       return ContentService.createTextOutput(
//         "Your message was successfully sent to the Googlesheet CABBOOKING database!"
//       );
//     } else {
//       // Handle unrecognized request
//       return ContentService.createTextOutput("Invalid request");
//     }
//   } else {
//     var requestData = JSON.parse(e.postData.getDataAsString());
//     var keyValue = requestData.key;

//     if (!keyValue) {
//       return ContentService.createTextOutput(
//         "Invalid or missing key in the request payload."
//       ).setMimeType(ContentService.MimeType.TEXT);
//     }

//     var output = [];

//     if (
//       keyValue === "A" ||
//       keyValue === "B" ||
//       keyValue === "C" ||
//       keyValue === "D"
//     ) {
//       var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
//       var sheet;

//       if (keyValue === "A") {
//         sheet = spreadsheet.getSheetByName("CONTACT");
//       } else if (keyValue === "B") {
//         sheet = spreadsheet.getSheetByName("CABBOOKING");
//       } else if (keyValue === "C") {
//         sheet = spreadsheet.getSheetByName("DRIVERCABDETAIL");
//       } else if (keyValue === "D") {
//         sheet = spreadsheet.getSheetByName("FEEDBACKDETAILS");
//       }

//       if (sheet) {
//         var headers = sheet
//           .getRange(1, 1, 1, sheet.getLastColumn())
//           .getValues()[0];

//         var values = sheet.getDataRange().getValues();

//         for (var i = 1; i < values.length; i++) {
//           var row = {};
//           for (var j = 0; j < headers.length; j++) {
//             row[headers[j]] = values[i][j];
//           }
//           output.push(row);
//         }
//       } else {
//         return ContentService.createTextOutput(
//           "Invalid key. Sheet not found."
//         ).setMimeType(ContentService.MimeType.TEXT);
//       }
//     } else {
//       return ContentService.createTextOutput("Invalid key.").setMimeType(
//         ContentService.MimeType.TEXT
//       );
//     }

//     return ContentService.createTextOutput(
//       JSON.stringify({ data: output })
//     ).setMimeType(ContentService.MimeType.JSON);
//   }
// }





// ========================SCRIPT CODE========================
// const sheets = SpreadsheetApp.openByUrl(
//     "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=0"
//   );
//   const sheet = sheets.getSheetByName("CONTACT");
  
//   const sheets2 = SpreadsheetApp.openByUrl(
//     "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=157462856"
//   );
//   const sheetB = sheets2.getSheetByName("CABBOOKING");
  
//   const sheets3 = SpreadsheetApp.openByUrl(
//     "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=941997358"
//   );
//   const sheetC = sheets3.getSheetByName("DRIVERCABDETAIL");
  
//   const sheets4 = SpreadsheetApp.openByUrl(
//     "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit#gid=917062512"
//   );
//   const sheetD = sheets4.getSheetByName("FEEDBACKDETAILS");
  
//   function doPost(e) {
//     // Assuming you have declared the sheets somewhere in your code
//     // For example: var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CONTACT");
//     var sheetA = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CONTACT");
//     var sheetB = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CABBOOKING");
//     var sheetC = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DRIVERCABDETAIL");
//     var sheetD = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FEEDBACKDETAILS");
  
//     let data = e.parameter;
  
//     // Check if the request is for CONTACT or CABBOOKING
//     if (data.hasOwnProperty("NAME") || data.hasOwnProperty("FIRSTNAME") || data.hasOwnProperty("DRIVERID") || data.hasOwnProperty("SUGGESTIONS")) {
//       // Do not re-declare 'data' here, use the existing one
  
//       // Check which type of data is being sent
//       if (data.hasOwnProperty("NAME")) {
//         sheetA.appendRow([data.NAME, data.EMAIL, data.MESSAGE]);
//         return ContentService.createTextOutput(
//           "Your message was successfully sent to the Googlesheet CONTACT database!"
//         );
//       } else if (data.hasOwnProperty("FIRSTNAME")) {
//         sheetB.appendRow([
//           data.FIRSTNAME,
//           data.LASTNAME,
//           data.EMAIL,
//           data.MOBILE,
//           data.FROMADDRESS,
//           data.TOADDRESS,
//           data.PERSON,
//           data.LUGGAGE,
//           data.JOURNEYDATE,
//           data.JOURNEYTIME,
//           data.MESSAGE,
//         ]);
//         return ContentService.createTextOutput(
//           "Your message was successfully sent to the Googlesheet CABBOOKING database!"
//         );
//       } else if (data.hasOwnProperty("DRIVERID")) {
//         sheetC.appendRow([
//           data.DRIVERID,
//           data.CARNUMBER,
//           data.DRIVERNAME,
//           data.EMPLOYEENAME,
//           data.DATE,
//           data.PICKUPLOCATION,
//           data.PICKUPTIME,
//           data.DROPLOCATION,
//           data.DROPTIME,
//           data.OPENINGREADING,
//           data.CLOSINGREADING,
//           data.TOTALRUNKMS,
//           data.EXTRAKMS,
//           data.NIGHTHALTS,
//           data.TOTALDAYS,
//         ]);
//         return ContentService.createTextOutput(
//           "Your message was successfully sent to the Googlesheet CABBOOKING database!"
//         );
//       } else if (data.hasOwnProperty("SUGGESTIONS")) {
//         sheetD.appendRow([
//           data.CUSTOMERNAME,
//           data.DRIVERNAME,
//           data.DATETIMERIDE,
//           data.BOOKNUMBER,
//           data.DRIVERBEHAVIOR,
//           data.SAFTY,
//           data.PUNCTUALITY,
//           data.SUGGESTIONS,
//           data.AGAINDRIVE,
//         ]);
//         return ContentService.createTextOutput(
//           "Your message was successfully sent to the Googlesheet CABBOOKING database!"
//         );
//       } else {
//         // Handle unrecognized request
//         return ContentService.createTextOutput("Invalid request");
//       }
//     } else {
//       // Process key-based requests
//       var requestData = JSON.parse(e.postData.getDataAsString());
//       var keyValue = requestData.key;
  
//       if (!keyValue) {
//         return ContentService.createTextOutput(
//           "Invalid or missing key in the request payload."
//         ).setMimeType(ContentService.MimeType.TEXT);
//       }
  
//       var output = [];
  
//       if (keyValue === "A" || keyValue === "B" || keyValue === "C" || keyValue === "D") {
//         var sheet;
  
//         if (keyValue === "A") {
//           sheet = sheetA;
//         } else if (keyValue === "B") {
//           sheet = sheetB;
//         } else if (keyValue === "C") {
//           sheet = sheetC;
//         } else if (keyValue === "D") {
//           sheet = sheetD;
//         }
  
//         if (sheet) {
//           var headers = sheet
//             .getRange(1, 1, 1, sheet.getLastColumn())
//             .getValues()[0];
  
//           var values = sheet.getDataRange().getValues();
  
//           for (var i = 1; i < values.length; i++) {
//             var row = {};
//             for (var j = 0; j < headers.length; j++) {
//               row[headers[j]] = values[i][j];
//             }
//             output.push(row);
//           }
//         } else {
//           return ContentService.createTextOutput(
//             "Invalid key. Sheet not found."
//           ).setMimeType(ContentService.MimeType.TEXT);
//         }
//       } else {
//         return ContentService.createTextOutput("Invalid key.").setMimeType(
//           ContentService.MimeType.TEXT
//         );
//       }
  
//       return ContentService.createTextOutput(
//         JSON.stringify({ data: output })
//       ).setMimeType(ContentService.MimeType.JSON);
//     }
//   }
  
  
