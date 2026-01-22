/**
 * ================================================================
 * UNION CABS - COMPLETE GOOGLE APPS SCRIPT (UPDATED)
 * ================================================================
 * 
 * COPY THIS ENTIRE CODE TO YOUR GOOGLE APPS SCRIPT EDITOR
 * Replace all existing code with this.
 * 
 * Required Sheets:
 * - CONTACT, CABBOOKING, FEEDBACKDETAILS (existing)
 * - GPSJOURNEY (existing)
 * - MASTER_COMPANIES (new)
 * - MASTER_DRIVERS (new)
 * - MASTER_EMPLOYEES (new)
 * - ECLAT_TRIPS or company-specific (new)
 * 
 * ================================================================
 */

const sheets = SpreadsheetApp.openByUrl(
  "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit?gid=0#gid=0"
);
const sheet = sheets.getSheetByName("CONTACT");

const sheets2 = SpreadsheetApp.openByUrl(
  "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit?gid=157462856#gid=157462856"
);
const sheetB = sheets2.getSheetByName("CABBOOKING");

const sheets3 = SpreadsheetApp.openByUrl(
  "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit?gid=941997358#gid=941997358"
);
const sheetC = sheets3.getSheetByName("DRIVERCABDETAIL");

const sheets4 = SpreadsheetApp.openByUrl(
  "https://docs.google.com/spreadsheets/d/1Rc1VIFr3l4c5ErJ4S5DGramk59fUyZ3_xsvBJh5B17k/edit?gid=917062512#gid=917062512"
);
const sheetD = sheets4.getSheetByName("FEEDBACKDETAILS");

// ============================================
// GET HANDLER - Fetch Configuration Data
// ============================================
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = e.parameter.action;
  
  try {
    // Fetch all configuration (companies, drivers, employees)
    if (action === "getAllConfig") {
      var companies = sheetToArray(ss.getSheetByName("MASTER_COMPANIES"));
      var drivers = sheetToArray(ss.getSheetByName("MASTER_DRIVERS"));
      var employees = sheetToArray(ss.getSheetByName("MASTER_EMPLOYEES"));
      
      return jsonResponse({
        success: true,
        data: {
          companies: companies,
          drivers: drivers,
          employees: employees
        }
      });
    }
    
    // Fetch companies only
    if (action === "getCompanies") {
      var data = sheetToArray(ss.getSheetByName("MASTER_COMPANIES"));
      return jsonResponse({ success: true, data: data });
    }
    
    // Fetch drivers only
    if (action === "getDrivers") {
      var data = sheetToArray(ss.getSheetByName("MASTER_DRIVERS"));
      return jsonResponse({ success: true, data: data });
    }
    
    // Fetch employees only
    if (action === "getEmployees") {
      var data = sheetToArray(ss.getSheetByName("MASTER_EMPLOYEES"));
      return jsonResponse({ success: true, data: data });
    }
    
    // Fetch journeys
    if (action === "getJourneys") {
      var data = sheetToArray(ss.getSheetByName("GPSJOURNEY"));
      return jsonResponse({ success: true, data: data });
    }
    
    // Fetch trip records from company-specific sheet
    if (action === "getTripRecords") {
      var sheetName = e.parameter.sheetName || "ECLAT_TRIPS";
      var tripSheet = ss.getSheetByName(sheetName);
      if (!tripSheet) {
        return jsonResponse({ success: false, message: "Sheet not found: " + sheetName, data: [] });
      }
      var data = sheetToArray(tripSheet);
      return jsonResponse({ success: true, data: data, sheetName: sheetName });
    }
    
    // Default response
    return ContentService.createTextOutput("Union Cabs API - Use action parameter")
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    return jsonResponse({ success: false, message: error.toString() });
  }
}

// ============================================
// POST HANDLER - All Form Submissions & Actions
// ============================================
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetA = ss.getSheetByName("CONTACT");
  var sheetB = ss.getSheetByName("CABBOOKING");
  var sheetC = ss.getSheetByName("DRIVERCABDETAIL");
  var sheetD = ss.getSheetByName("FEEDBACKDETAILS");
  var sheetG = ss.getSheetByName("GPSJOURNEY");

  try {
    let data = e.parameter;
    
    if (!data) {
      throw new Error("No data received");
    }

    var action = data.action;

    // ========================================
    // CONFIGURATION ACTIONS (NEW)
    // ========================================
    
    // Add Company
    if (action === "addCompany") {
      var sheet = ss.getSheetByName("MASTER_COMPANIES");
      if (!sheet) throw new Error("MASTER_COMPANIES sheet not found");
      sheet.appendRow([
        data.COMPANY_ID,
        data.COMPANY_NAME,
        data.COMPANY_CODE,
        data.SHEET_NAME,
        data.IS_ACTIVE
      ]);
      return jsonResponse({ success: true, message: "Company added successfully" });
    }
    
    // Add Driver
    if (action === "addDriver") {
      var sheet = ss.getSheetByName("MASTER_DRIVERS");
      if (!sheet) throw new Error("MASTER_DRIVERS sheet not found");
      sheet.appendRow([
        data.DRIVER_ID,
        data.COMPANY_ID,
        data.CAB_NO,
        data.DRIVER_NAME,
        data.DRIVER_MOBILE,
        data.VEHICLE_NO,
        data.DRIVER_EMP_ID,
        data.VENDOR_NAME,
        data.ESCORT_NAME,
        data.ESCORT_MOBILE,
        data.IS_ACTIVE
      ]);
      return jsonResponse({ success: true, message: "Driver added successfully" });
    }
    
    // Add Employee
    if (action === "addEmployee") {
      var sheet = ss.getSheetByName("MASTER_EMPLOYEES");
      if (!sheet) throw new Error("MASTER_EMPLOYEES sheet not found");
      sheet.appendRow([
        data.EMP_ID,
        data.COMPANY_ID,
        data.EMP_NAME,
        data.EMP_CODE,
        data.CAB_ID,
        data.IS_ACTIVE
      ]);
      return jsonResponse({ success: true, message: "Employee added successfully" });
    }
    
    // Update Company
    if (action === "updateCompany") {
      var sheet = ss.getSheetByName("MASTER_COMPANIES");
      if (!sheet) throw new Error("MASTER_COMPANIES sheet not found");
      var updated = updateRowById(sheet, "COMPANY_ID", data.COMPANY_ID, {
        "COMPANY_NAME": data.COMPANY_NAME,
        "COMPANY_CODE": data.COMPANY_CODE,
        "SHEET_NAME": data.SHEET_NAME,
        "IS_ACTIVE": data.IS_ACTIVE
      });
      return jsonResponse({ success: updated, message: updated ? "Company updated" : "Company not found" });
    }
    
    // Update Driver
    if (action === "updateDriver") {
      var sheet = ss.getSheetByName("MASTER_DRIVERS");
      if (!sheet) throw new Error("MASTER_DRIVERS sheet not found");
      var updated = updateRowById(sheet, "DRIVER_ID", data.DRIVER_ID, {
        "COMPANY_ID": data.COMPANY_ID,
        "CAB_NO": data.CAB_NO,
        "DRIVER_NAME": data.DRIVER_NAME,
        "DRIVER_MOBILE": data.DRIVER_MOBILE,
        "VEHICLE_NO": data.VEHICLE_NO,
        "DRIVER_EMP_ID": data.DRIVER_EMP_ID,
        "VENDOR_NAME": data.VENDOR_NAME,
        "ESCORT_NAME": data.ESCORT_NAME,
        "ESCORT_MOBILE": data.ESCORT_MOBILE,
        "IS_ACTIVE": data.IS_ACTIVE
      });
      return jsonResponse({ success: updated, message: updated ? "Driver updated" : "Driver not found" });
    }
    
    // Update Employee
    if (action === "updateEmployee") {
      var sheet = ss.getSheetByName("MASTER_EMPLOYEES");
      if (!sheet) throw new Error("MASTER_EMPLOYEES sheet not found");
      var updated = updateRowById(sheet, "EMP_ID", data.EMP_ID, {
        "COMPANY_ID": data.COMPANY_ID,
        "EMP_NAME": data.EMP_NAME,
        "EMP_CODE": data.EMP_CODE,
        "CAB_ID": data.CAB_ID,
        "IS_ACTIVE": data.IS_ACTIVE
      });
      return jsonResponse({ success: updated, message: updated ? "Employee updated" : "Employee not found" });
    }
    
    // Delete Company
    if (action === "deleteCompany") {
      var sheet = ss.getSheetByName("MASTER_COMPANIES");
      if (!sheet) throw new Error("MASTER_COMPANIES sheet not found");
      var deleted = deleteRowById(sheet, "COMPANY_ID", data.id);
      return jsonResponse({ success: deleted, message: deleted ? "Company deleted" : "Company not found" });
    }
    
    // Delete Driver
    if (action === "deleteDriver") {
      var sheet = ss.getSheetByName("MASTER_DRIVERS");
      if (!sheet) throw new Error("MASTER_DRIVERS sheet not found");
      var deleted = deleteRowById(sheet, "DRIVER_ID", data.id);
      return jsonResponse({ success: deleted, message: deleted ? "Driver deleted" : "Driver not found" });
    }
    
    // Delete Employee
    if (action === "deleteEmployee") {
      var sheet = ss.getSheetByName("MASTER_EMPLOYEES");
      if (!sheet) throw new Error("MASTER_EMPLOYEES sheet not found");
      var deleted = deleteRowById(sheet, "EMP_ID", data.id);
      return jsonResponse({ success: deleted, message: deleted ? "Employee deleted" : "Employee not found" });
    }
    
    // Add Trip Record to Company-Specific Sheet
    if (action === "addTripRecord") {
      var tripSheetName = data.SHEET_NAME || "ECLAT_TRIPS";
      var tripSheet = ss.getSheetByName(tripSheetName);
      if (!tripSheet) throw new Error("Trip sheet not found: " + tripSheetName);
      tripSheet.appendRow([
        data.DATE,
        data.TRIPID,
        data.CABNO,
        data.VENDORNAME,
        data.DRIVERNAME,
        data.DRIVERMOBILE,
        data.ESCORTNAME,
        data.ESCORTMOBILE,
        data.EMPLOYEENAME,
        data.EMPID,
        data.TRIPTYPE,
        data.PICKUPLOCATION,
        data.PICKUPTIME,
        data.PICKUPMETERREADING,
        data.DROPOFFLOCATION,
        data.DROPOFFTIME,
        data.DROPOFFMETERREADING,
        data.TOTALKM,
        data.SHIFTTIMING,
        data.GPSENABLED,
        data.DELAY,
        data.REMARKS
      ]);
      return jsonResponse({ success: true, message: "Trip record saved to " + tripSheetName });
    }

    // ========================================
    // KEY-BASED FETCH (EXISTING - for admin portal)
    // ========================================
    if (data.key) {
      var output = [];
      var targetSheet;

      switch(data.key) {
        case "A":
          targetSheet = sheetA;
          break;
        case "B":
          targetSheet = sheetB;
          break;
        case "C":
          targetSheet = sheetC;
          break;
        case "D":
          targetSheet = sheetD;
          break;
        case "G":
          targetSheet = sheetG;
          break;
        default:
          throw new Error("Invalid key: " + data.key);
      }

      if (!targetSheet) {
        throw new Error("Sheet not found for key: " + data.key);
      }

      var lastRow = targetSheet.getLastRow();
      var lastColumn = targetSheet.getLastColumn();
      
      if (lastColumn === 0 || lastRow === 0) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var allData = targetSheet.getRange(1, 1, lastRow, lastColumn).getValues();
      var headers = allData[0];

      for (var i = 1; i < allData.length; i++) {
        var row = {};
        for (var j = 0; j < headers.length; j++) {
          var headerName = headers[j].toString().trim();
          var cellValue = allData[i][j];
          
          if (cellValue === null || cellValue === undefined) {
            row[headerName] = "";
          } else {
            row[headerName] = cellValue.toString();
          }
        }
        output.push(row);
      }

      return ContentService.createTextOutput(JSON.stringify({ data: output }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ========================================
    // FORM SUBMISSIONS (EXISTING)
    // ========================================
    
    // GPS Journey Tracking Form
    if (data.FORMTYPE && data.FORMTYPE === "GPSJOURNEY") {
      if (!sheetG) {
        throw new Error("GPSJOURNEY sheet not found. Please create it first.");
      }
      sheetG.appendRow([
        data.JOURNEYID || '',
        data.DRIVERNAME || '',
        data.DRIVERMOBILE || '',
        data.CABNO || '',
        data.VEHICLENO || '',
        data.DATE || '',
        data.STARTTIME || '',
        data.ENDTIME || '',
        data.TOTALKM || '0',
        data.TOTALSTOPS || '0',
        data.STARTLAT || '',
        data.STARTLNG || '',
        data.STARTADDRESS || '',
        data.ENDLAT || '',
        data.ENDLNG || '',
        data.ENDADDRESS || '',
        data.ALLSTOPS || '[]',
        data.AUTOLOGS || '0',
        data.GPSLOST || '0',
        data.RECOVERED || '0',
        data.SUSPICIOUS || 'NO'
      ]);
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true, 
        message: "GPS Journey data saved successfully!" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Contact form
    if (data.NAME && !action) {
      sheetA.appendRow([data.NAME, data.EMAIL, data.MESSAGE]);
      return ContentService.createTextOutput("Successfully submitted to CONTACT sheet");
    }
    
    // Cab booking form
    if (data.FIRSTNAME) {
      sheetB.appendRow([
        data.FIRSTNAME,
        data.LASTNAME,
        data.EMAIL,
        data.MOBILE,
        data.FROMADDRESS,
        data.TOADDRESS,
        data.PERSON,
        data.LUGGAGE,
        data.JOURNEYDATE,
        data.JOURNEYTIME,
        data.MESSAGE,
      ]);
      return ContentService.createTextOutput("Successfully submitted to CABBOOKING sheet");
    }
    
    // Driver cab details form (22 columns) - Legacy support
    if (data.TRIPID && !action) {
      sheetC.appendRow([
        data.DATE,
        data.TRIPID,
        data.CABNO,
        data.VENDORNAME,
        data.DRIVERNAME,
        data.DRIVERMOBILE,
        data.ESCORTNAME,
        data.ESCORTIDMOBILE,
        data.EMPLOYEENAME,
        data.EMPID,
        data.TRIPTYPE,
        data.PICKUPLOCATION,
        data.PICKUPTIME,
        data.PICKUPMETERREADING,
        data.DROPOFFLOCATION,
        data.DROPOFFTIME,
        data.DROPOFFMETERREADING,
        data.TOTALKM,
        data.SHIFTTIMING,
        data.GPSENABLED,
        data.DELAY,
        data.REMARKS
      ]);
      return ContentService.createTextOutput("Successfully submitted to DRIVERCABDETAIL sheet");
    }
    
    // Feedback form
    if (data.SUGGESTIONS) {
      sheetD.appendRow([
        data.CUSTOMERNAME,
        data.DRIVERNAME,
        data.DATETIMERIDE,
        data.BOOKNUMBER,
        data.DRIVERBEHAVIOR,
        data.SAFTY,
        data.PUNCTUALITY,
        data.SUGGESTIONS,
        data.AGAINDRIVE,
      ]);
      return ContentService.createTextOutput("Successfully submitted to FEEDBACKDETAILS sheet");
    }

    throw new Error("Invalid form submission - no matching form type found");

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      error: true, 
      message: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert sheet data to array of objects
 */
function sheetToArray(sheet) {
  if (!sheet) return [];
  
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  if (lastRow < 2 || lastColumn === 0) return [];
  
  var data = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  var headers = data[0];
  var rows = data.slice(1);
  
  return rows.map(function(row) {
    var obj = {};
    headers.forEach(function(header, index) {
      var headerName = header.toString().trim();
      var cellValue = row[index];
      if (cellValue === null || cellValue === undefined) {
        obj[headerName] = "";
      } else {
        obj[headerName] = cellValue.toString();
      }
    });
    return obj;
  }).filter(function(obj) {
    return Object.values(obj).some(function(val) { return val !== ""; });
  });
}

/**
 * Update a row by ID column
 */
function updateRowById(sheet, idColumn, idValue, updates) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = -1;
  
  // Find ID column index
  for (var j = 0; j < headers.length; j++) {
    if (headers[j].toString().trim() === idColumn) {
      idIndex = j;
      break;
    }
  }
  
  if (idIndex === -1) return false;
  
  // Find row with matching ID
  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex].toString() === idValue.toString()) {
      // Update each field
      Object.keys(updates).forEach(function(key) {
        for (var k = 0; k < headers.length; k++) {
          if (headers[k].toString().trim() === key) {
            sheet.getRange(i + 1, k + 1).setValue(updates[key]);
            break;
          }
        }
      });
      return true;
    }
  }
  
  return false;
}

/**
 * Delete a row by ID column
 */
function deleteRowById(sheet, idColumn, idValue) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = -1;
  
  // Find ID column index
  for (var j = 0; j < headers.length; j++) {
    if (headers[j].toString().trim() === idColumn) {
      idIndex = j;
      break;
    }
  }
  
  if (idIndex === -1) return false;
  
  // Find and delete row with matching ID
  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex].toString() === idValue.toString()) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  
  return false;
}

/**
 * Create JSON response
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
