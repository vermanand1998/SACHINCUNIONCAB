/**
 * CONFIGURATION SERVICE
 * =====================
 * Handles fetching and caching of master configuration data from Google Sheets
 */

import { googleSheetUrl } from "../urlandKeys";

// Cache configuration
const CACHE_KEY = 'app_config_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all configuration from Google Sheets
 */
export const fetchAllConfig = async () => {
  try {
    // Try cache first
    const cached = getFromCache();
    if (cached) {
      console.log("📦 Using cached configuration");
      return cached;
    }

    console.log("🔄 Fetching configuration from Google Sheets...");
    
    const response = await fetch(`${googleSheetUrl}?action=getAllConfig`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch configuration');
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      // Transform and cache the data
      const config = transformSheetData(result.data);
      saveToCache(config);
      console.log("✅ Configuration loaded successfully");
      return config;
    } else {
      throw new Error(result.message || 'Invalid response');
    }
  } catch (error) {
    console.error("❌ Error fetching configuration:", error);
    
    // Try to return cached data even if expired
    const expiredCache = localStorage.getItem(CACHE_KEY);
    if (expiredCache) {
      console.log("⚠️ Using expired cache as fallback");
      return JSON.parse(expiredCache).data;
    }
    
    // Return default data as last resort
    return getDefaultConfig();
  }
};

/**
 * Fetch companies only
 */
export const fetchCompanies = async () => {
  try {
    const response = await fetch(`${googleSheetUrl}?action=getCompanies`);
    const result = await response.json();
    
    if (result.success) {
      return transformCompanies(result.data);
    }
    return [];
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
};

/**
 * Fetch drivers only
 */
export const fetchDrivers = async () => {
  try {
    const response = await fetch(`${googleSheetUrl}?action=getDrivers`);
    const result = await response.json();
    
    if (result.success) {
      return transformDrivers(result.data);
    }
    return [];
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return [];
  }
};

/**
 * Fetch employees only
 */
export const fetchEmployees = async () => {
  try {
    const response = await fetch(`${googleSheetUrl}?action=getEmployees`);
    const result = await response.json();
    
    if (result.success) {
      return transformEmployees(result.data);
    }
    return [];
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

/**
 * Add a new company
 */
export const addCompany = async (company) => {
  const formData = new FormData();
  formData.append('action', 'addCompany');
  formData.append('COMPANY_ID', company.id || Date.now());
  formData.append('COMPANY_NAME', company.name);
  formData.append('COMPANY_CODE', company.code);
  formData.append('SHEET_NAME', company.sheetName);
  formData.append('IS_ACTIVE', company.isActive ? 'TRUE' : 'FALSE');

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Add a new driver
 */
export const addDriver = async (driver) => {
  const formData = new FormData();
  formData.append('action', 'addDriver');
  formData.append('DRIVER_ID', driver.id || Date.now());
  formData.append('COMPANY_ID', driver.companyId);
  formData.append('CAB_NO', driver.cabNo);
  formData.append('DRIVER_NAME', driver.driverName);
  formData.append('DRIVER_MOBILE', driver.driverMobile);
  formData.append('VEHICLE_NO', driver.vehicleNo || '');
  formData.append('DRIVER_EMP_ID', driver.driverEmpId || '');
  formData.append('VENDOR_NAME', driver.vendorName || 'Union Services');
  formData.append('ESCORT_NAME', driver.escortName || '');
  formData.append('ESCORT_MOBILE', driver.escortMobile || '');
  formData.append('IS_ACTIVE', driver.isActive ? 'TRUE' : 'FALSE');

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Add a new employee
 */
export const addEmployee = async (employee) => {
  const formData = new FormData();
  formData.append('action', 'addEmployee');
  formData.append('EMP_ID', employee.id || Date.now());
  formData.append('COMPANY_ID', employee.companyId);
  formData.append('EMP_NAME', employee.name);
  formData.append('EMP_CODE', employee.empCode);
  formData.append('CAB_ID', employee.cabId || '');
  formData.append('IS_ACTIVE', employee.isActive ? 'TRUE' : 'FALSE');

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Update a company
 */
export const updateCompany = async (company) => {
  const formData = new FormData();
  formData.append('action', 'updateCompany');
  formData.append('COMPANY_ID', company.id);
  formData.append('COMPANY_NAME', company.name);
  formData.append('COMPANY_CODE', company.code);
  formData.append('SHEET_NAME', company.sheetName);
  formData.append('IS_ACTIVE', company.isActive ? 'TRUE' : 'FALSE');

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Update a driver
 */
export const updateDriver = async (driver) => {
  const formData = new FormData();
  formData.append('action', 'updateDriver');
  formData.append('DRIVER_ID', driver.id);
  formData.append('COMPANY_ID', driver.companyId);
  formData.append('CAB_NO', driver.cabNo);
  formData.append('DRIVER_NAME', driver.driverName);
  formData.append('DRIVER_MOBILE', driver.driverMobile);
  formData.append('VEHICLE_NO', driver.vehicleNo || '');
  formData.append('DRIVER_EMP_ID', driver.driverEmpId || '');
  formData.append('VENDOR_NAME', driver.vendorName || 'Union Services');
  formData.append('ESCORT_NAME', driver.escortName || '');
  formData.append('ESCORT_MOBILE', driver.escortMobile || '');
  formData.append('IS_ACTIVE', driver.isActive ? 'TRUE' : 'FALSE');

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Update an employee
 */
export const updateEmployee = async (employee) => {
  const formData = new FormData();
  formData.append('action', 'updateEmployee');
  formData.append('EMP_ID', employee.id);
  formData.append('COMPANY_ID', employee.companyId);
  formData.append('EMP_NAME', employee.name);
  formData.append('EMP_CODE', employee.empCode);
  formData.append('CAB_ID', employee.cabId || '');
  formData.append('IS_ACTIVE', employee.isActive ? 'TRUE' : 'FALSE');

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Delete a company
 */
export const deleteCompany = async (id) => {
  const formData = new FormData();
  formData.append('action', 'deleteCompany');
  formData.append('id', id);

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Delete a driver
 */
export const deleteDriver = async (id) => {
  const formData = new FormData();
  formData.append('action', 'deleteDriver');
  formData.append('id', id);

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (id) => {
  const formData = new FormData();
  formData.append('action', 'deleteEmployee');
  formData.append('id', id);

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  clearCache();
  return response.json();
};

/**
 * Submit trip record to company-specific sheet
 */
export const submitTripRecord = async (trip, sheetName) => {
  const formData = new FormData();
  formData.append('action', 'addTripRecord');
  formData.append('SHEET_NAME', sheetName);
  formData.append('DATE', trip.date);
  formData.append('TRIPID', trip.tripId);
  formData.append('CABNO', trip.cabNo);
  formData.append('VENDORNAME', trip.vendorName);
  formData.append('DRIVERNAME', trip.driverName);
  formData.append('DRIVERMOBILE', trip.driverMobile);
  formData.append('ESCORTNAME', trip.escortName || '');
  formData.append('ESCORTMOBILE', trip.escortMobile || '');
  formData.append('EMPLOYEENAME', trip.employeeName);
  formData.append('EMPID', trip.empId);
  formData.append('TRIPTYPE', trip.tripType);
  formData.append('PICKUPLOCATION', trip.pickupLocation);
  formData.append('PICKUPTIME', trip.pickupTime);
  formData.append('PICKUPMETERREADING', trip.pickupMeterReading);
  formData.append('DROPOFFLOCATION', trip.dropLocation);
  formData.append('DROPOFFTIME', trip.dropTime);
  formData.append('DROPOFFMETERREADING', trip.dropMeterReading);
  formData.append('TOTALKM', trip.totalKm);
  formData.append('SHIFTTIMING', trip.shiftTiming);
  formData.append('GPSENABLED', trip.gpsEnabled || 'YES');
  formData.append('DELAY', trip.delay || '');
  formData.append('REMARKS', trip.remarks || '');

  const response = await fetch(googleSheetUrl, {
    method: 'POST',
    body: formData
  });

  return response.json();
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function transformSheetData(data) {
  return {
    companies: transformCompanies(data.companies || []),
    drivers: transformDrivers(data.drivers || []),
    employees: transformEmployees(data.employees || [])
  };
}

// Helper to parse IS_ACTIVE value from sheet (handles all formats)
function parseIsActive(value) {
  // Debug log to see what value is coming from sheet
  console.log("🔍 IS_ACTIVE raw value:", value, "type:", typeof value);
  
  if (value === true || value === false) return value;
  if (typeof value === 'string') {
    const v = value.toUpperCase().trim();
    return v === 'TRUE' || v === 'YES' || v === '1' || v === 'ACTIVE';
  }
  // Default to true if value is empty (assume active)
  if (value === '' || value === undefined || value === null) return true;
  return false;
}

function transformCompanies(rows) {
  return rows.map(row => ({
    id: parseInt(row.COMPANY_ID) || 0,
    name: row.COMPANY_NAME || '',
    code: row.COMPANY_CODE || '',
    sheetName: row.SHEET_NAME || '',
    isActive: parseIsActive(row.IS_ACTIVE)
  })).filter(c => c.name);
}

function transformDrivers(rows) {
  return rows.map(row => ({
    id: parseInt(row.DRIVER_ID) || 0,
    companyId: parseInt(row.COMPANY_ID) || 0,
    cabNo: row.CAB_NO || '',
    driverName: row.DRIVER_NAME || '',
    driverMobile: row.DRIVER_MOBILE || '',
    vehicleNo: row.VEHICLE_NO || '',
    driverEmpId: row.DRIVER_EMP_ID || '',
    vendorName: row.VENDOR_NAME || 'Union Services',
    escortName: row.ESCORT_NAME || '',
    escortMobile: row.ESCORT_MOBILE || '',
    isActive: parseIsActive(row.IS_ACTIVE)
  })).filter(d => d.driverName);
}

function transformEmployees(rows) {
  return rows.map(row => ({
    id: parseInt(row.EMP_ID) || 0,
    companyId: parseInt(row.COMPANY_ID) || 0,
    name: row.EMP_NAME || '',
    empCode: row.EMP_CODE || '',
    cabId: parseInt(row.CAB_ID) || null,
    isActive: parseIsActive(row.IS_ACTIVE)
  })).filter(e => e.name);
}

function getFromCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const isValid = Date.now() - timestamp < CACHE_DURATION;
    
    return isValid ? data : null;
  } catch {
    return null;
  }
}

function saveToCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error("Error saving to cache:", error);
  }
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
  console.log("🗑️ Configuration cache cleared");
}

function getDefaultConfig() {
  return {
    companies: [
      { id: 1, name: "Eclat Engineering", code: "ECLAT", sheetName: "ECLAT_TRIPS", isActive: true }
    ],
    drivers: [
      { id: 1, companyId: 1, cabNo: "CAB-1", driverName: "SIDDHARTH SINGH", driverMobile: "6388499177", vehicleNo: "UP32TN5393", driverEmpId: "UC-0009", vendorName: "Union Services", escortName: "DEEPAK YADAV", escortMobile: "6388320196", isActive: true },
      { id: 2, companyId: 1, cabNo: "CAB-2", driverName: "RAHUL KASHYAP", driverMobile: "7355713216", vehicleNo: "UP32ZN7576", driverEmpId: "UC-0008", vendorName: "Union Services", escortName: "ANUJ SINGH", escortMobile: "7355713217", isActive: true },
      { id: 3, companyId: 1, cabNo: "CAB-3", driverName: "FAIZ KHAN", driverMobile: "6388320195", vehicleNo: "UP32TN4911", driverEmpId: "UC-0007", vendorName: "Union Services", escortName: "DHEERAJ RATHORE", escortMobile: "6388320194", isActive: true }
    ],
    employees: [
      { id: 1, companyId: 1, name: "Sujata Sharma", empCode: "EHS5665", cabId: 1, isActive: true },
      { id: 2, companyId: 1, name: "Swetha Pandey", empCode: "EHS3072", cabId: 1, isActive: true },
      { id: 3, companyId: 1, name: "Veena Nigam", empCode: "EHS5667", cabId: 1, isActive: true },
      { id: 4, companyId: 1, name: "Riya Kumari", empCode: "EHS5661", cabId: 2, isActive: true },
      { id: 5, companyId: 1, name: "Pragati Pandey", empCode: "EHS5804", cabId: 2, isActive: true },
      { id: 6, companyId: 1, name: "Ananya Singh", empCode: "EHS5644", cabId: 2, isActive: true },
      { id: 7, companyId: 1, name: "Reet Tandon", empCode: "EHS5660", cabId: 3, isActive: true },
      { id: 8, companyId: 1, name: "Anamika Rani", empCode: "EHS5643", cabId: 3, isActive: true },
      { id: 9, companyId: 1, name: "Garima Singh", empCode: "EHS5652", cabId: 3, isActive: true }
    ]
  };
}
