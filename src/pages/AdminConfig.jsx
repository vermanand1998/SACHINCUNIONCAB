import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "reactstrap";
import { toast } from 'react-toastify';
import CommonSection from "../components/UI/CommonSection";
import {
  fetchAllConfig,
  addCompany,
  addDriver,
  addEmployee,
  updateCompany,
  updateDriver,
  updateEmployee,
  deleteCompany,
  deleteDriver,
  deleteEmployee,
  clearCache
} from "../services/configService";
import "../styles/admin-config.css";

const AdminConfig = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data State
  const [companies, setCompanies] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // Form States
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  
  const [companyForm, setCompanyForm] = useState({ id: null, name: "", code: "", sheetName: "", isActive: true });
  const [driverForm, setDriverForm] = useState({ id: null, companyId: 1, cabNo: "", driverName: "", driverMobile: "", vehicleNo: "", driverEmpId: "", vendorName: "Union Services", escortName: "", escortMobile: "", isActive: true });
  const [employeeForm, setEmployeeForm] = useState({ id: null, companyId: 1, name: "", empCode: "", cabId: null, isActive: true });
  
  const [selectedCompany, setSelectedCompany] = useState("");

  // Load configuration on mount
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setIsLoading(true);
    try {
      const config = await fetchAllConfig();
      setCompanies(config.companies || []);
      setDrivers(config.drivers || []);
      setEmployees(config.employees || []);
      toast.success("Configuration loaded successfully!");
    } catch (error) {
      console.error("Error loading config:", error);
      toast.error("Failed to load configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    clearCache();
    await loadConfiguration();
  };

  // Company Functions
  const handleAddCompany = () => {
    setCompanyForm({ id: null, name: "", code: "", sheetName: "", isActive: true });
    setShowCompanyForm(true);
  };

  const handleEditCompany = (company) => {
    setCompanyForm(company);
    setShowCompanyForm(true);
  };

  const handleSaveCompany = async () => {
    if (!companyForm.name || !companyForm.code || !companyForm.sheetName) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSaving(true);
    try {
      if (companyForm.id) {
        await updateCompany(companyForm);
        toast.success("Company updated!");
      } else {
        await addCompany({ ...companyForm, id: Date.now() });
        toast.success("Company added!");
      }
      setShowCompanyForm(false);
      await refreshData();
    } catch (error) {
      toast.error("Failed to save company");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    
    setIsSaving(true);
    try {
      await deleteCompany(id);
      toast.success("Company deleted!");
      await refreshData();
    } catch (error) {
      toast.error("Failed to delete company");
    } finally {
      setIsSaving(false);
    }
  };

  // Driver Functions
  const handleAddDriver = () => {
    setDriverForm({ id: null, companyId: companies[0]?.id || 1, cabNo: "", driverName: "", driverMobile: "", vehicleNo: "", driverEmpId: "", vendorName: "Union Services", escortName: "", escortMobile: "", isActive: true });
    setShowDriverForm(true);
  };

  const handleEditDriver = (driver) => {
    setDriverForm(driver);
    setShowDriverForm(true);
  };

  const handleSaveDriver = async () => {
    if (!driverForm.cabNo || !driverForm.driverName || !driverForm.driverMobile) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSaving(true);
    try {
      if (driverForm.id) {
        await updateDriver(driverForm);
        toast.success("Driver updated!");
      } else {
        await addDriver({ ...driverForm, id: Date.now() });
        toast.success("Driver added!");
      }
      setShowDriverForm(false);
      await refreshData();
    } catch (error) {
      toast.error("Failed to save driver");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDriver = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    
    setIsSaving(true);
    try {
      await deleteDriver(id);
      toast.success("Driver deleted!");
      await refreshData();
    } catch (error) {
      toast.error("Failed to delete driver");
    } finally {
      setIsSaving(false);
    }
  };

  // Employee Functions
  const handleAddEmployee = () => {
    setEmployeeForm({ id: null, companyId: companies[0]?.id || 1, name: "", empCode: "", cabId: null, isActive: true });
    setShowEmployeeForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEmployeeForm(employee);
    setShowEmployeeForm(true);
  };

  const handleSaveEmployee = async () => {
    if (!employeeForm.name || !employeeForm.empCode) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSaving(true);
    try {
      if (employeeForm.id) {
        await updateEmployee(employeeForm);
        toast.success("Employee updated!");
      } else {
        await addEmployee({ ...employeeForm, id: Date.now() });
        toast.success("Employee added!");
      }
      setShowEmployeeForm(false);
      await refreshData();
    } catch (error) {
      toast.error("Failed to save employee");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    
    setIsSaving(true);
    try {
      await deleteEmployee(id);
      toast.success("Employee deleted!");
      await refreshData();
    } catch (error) {
      toast.error("Failed to delete employee");
    } finally {
      setIsSaving(false);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown';
  };

  const getDriverInfo = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.cabNo} - ${driver.driverName}` : 'Unassigned';
  };

  if (isLoading) {
    return (
      <div className="admin-config-wrapper">
        <CommonSection title="System Configuration" />
        <div className="loading-container">
          <Spinner color="warning" />
          <p>Loading configuration from Google Sheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-config-wrapper">
      <CommonSection title="System Configuration" />
      
      <Container className="config-container">
        <div className="config-header">
          <h2><i className="ri-settings-3-line"></i> Admin Configuration Portal</h2>
          <p>Manage companies, drivers, and employees - synced with Google Sheets</p>
          <button className="refresh-btn" onClick={refreshData} disabled={isLoading}>
            <i className="ri-refresh-line"></i> Refresh Data
          </button>
        </div>

        {/* Tabs */}
        <div className="config-tabs">
          <button className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>
            <i className="ri-building-line"></i> Companies ({companies.length})
          </button>
          <button className={`tab-btn ${activeTab === 'drivers' ? 'active' : ''}`} onClick={() => setActiveTab('drivers')}>
            <i className="ri-steering-2-line"></i> Drivers ({drivers.length})
          </button>
          <button className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
            <i className="ri-group-line"></i> Employees ({employees.length})
          </button>
        </div>

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="config-content">
            <div className="content-header">
              <h3>Companies Management</h3>
              <button className="add-btn" onClick={handleAddCompany}>
                <i className="ri-add-line"></i> Add Company
              </button>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company Name</th>
                    <th>Code</th>
                    <th>Sheet Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr><td colSpan="6" className="no-data">No companies found</td></tr>
                  ) : companies.map(company => (
                    <tr key={company.id}>
                      <td>{company.id}</td>
                      <td><strong>{company.name}</strong></td>
                      <td><span className="badge">{company.code}</span></td>
                      <td>{company.sheetName}</td>
                      <td><span className={`status ${company.isActive ? 'active' : 'inactive'}`}>{company.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEditCompany(company)}><i className="ri-edit-line"></i></button>
                        <button className="delete-btn" onClick={() => handleDeleteCompany(company.id)}><i className="ri-delete-bin-line"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div className="config-content">
            <div className="content-header">
              <h3>Drivers Management</h3>
              <div className="header-actions">
                <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="company-filter">
                  <option value="">All Companies</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button className="add-btn" onClick={handleAddDriver}><i className="ri-add-line"></i> Add Driver</button>
              </div>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Cab No</th>
                    <th>Driver Name</th>
                    <th>Mobile</th>
                    <th>Vehicle</th>
                    <th>Company</th>
                    <th>Escort</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.filter(d => !selectedCompany || d.companyId === parseInt(selectedCompany)).length === 0 ? (
                    <tr><td colSpan="8" className="no-data">No drivers found</td></tr>
                  ) : drivers.filter(d => !selectedCompany || d.companyId === parseInt(selectedCompany)).map(driver => (
                    <tr key={driver.id}>
                      <td><strong>{driver.cabNo}</strong></td>
                      <td>{driver.driverName}</td>
                      <td>{driver.driverMobile}</td>
                      <td>{driver.vehicleNo}</td>
                      <td><span className="badge">{getCompanyName(driver.companyId)}</span></td>
                      <td>{driver.escortName || '-'}</td>
                      <td><span className={`status ${driver.isActive ? 'active' : 'inactive'}`}>{driver.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEditDriver(driver)}><i className="ri-edit-line"></i></button>
                        <button className="delete-btn" onClick={() => handleDeleteDriver(driver.id)}><i className="ri-delete-bin-line"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="config-content">
            <div className="content-header">
              <h3>Employees Management</h3>
              <div className="header-actions">
                <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="company-filter">
                  <option value="">All Companies</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button className="add-btn" onClick={handleAddEmployee}><i className="ri-add-line"></i> Add Employee</button>
              </div>
            </div>

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Emp Code</th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Assigned Cab</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.filter(e => !selectedCompany || e.companyId === parseInt(selectedCompany)).length === 0 ? (
                    <tr><td colSpan="6" className="no-data">No employees found</td></tr>
                  ) : employees.filter(e => !selectedCompany || e.companyId === parseInt(selectedCompany)).map(emp => (
                    <tr key={emp.id}>
                      <td><strong>{emp.empCode}</strong></td>
                      <td>{emp.name}</td>
                      <td><span className="badge">{getCompanyName(emp.companyId)}</span></td>
                      <td>{emp.cabId ? getDriverInfo(emp.cabId) : 'Unassigned'}</td>
                      <td><span className={`status ${emp.isActive ? 'active' : 'inactive'}`}>{emp.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEditEmployee(emp)}><i className="ri-edit-line"></i></button>
                        <button className="delete-btn" onClick={() => handleDeleteEmployee(emp.id)}><i className="ri-delete-bin-line"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Company Modal */}
        {showCompanyForm && (
          <div className="modal-overlay" onClick={() => setShowCompanyForm(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3><i className="ri-building-4-fill"></i> {companyForm.id ? 'Edit Company' : 'Add New Company'}</h3>
                <button className="close-btn" onClick={() => setShowCompanyForm(false)}><i className="ri-close-line"></i></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Company Name <span className="required">*</span></label>
                  <input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} placeholder="Enter company name" />
                </div>
                <div className="form-group">
                  <label>Company Code <span className="required">*</span></label>
                  <input type="text" value={companyForm.code} onChange={e => setCompanyForm({...companyForm, code: e.target.value.toUpperCase()})} placeholder="e.g., ECLAT" />
                </div>
                <div className="form-group">
                  <label>Google Sheet Name <span className="required">*</span></label>
                  <input type="text" value={companyForm.sheetName} onChange={e => setCompanyForm({...companyForm, sheetName: e.target.value})} placeholder="e.g., ECLAT_TRIPS" />
                  <small>This sheet will store trip records for this company</small>
                </div>
                <div className="form-group">
                  <label className={`checkbox-label ${companyForm.isActive ? 'checked' : ''}`}>
                    <input type="checkbox" checked={companyForm.isActive} onChange={e => setCompanyForm({...companyForm, isActive: e.target.checked})} />
                    <span>Active</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowCompanyForm(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSaveCompany} disabled={isSaving}>
                  {isSaving ? <Spinner size="sm" /> : <><i className="ri-save-line"></i> Save</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Driver Modal */}
        {showDriverForm && (
          <div className="modal-overlay" onClick={() => setShowDriverForm(false)}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3><i className="ri-taxi-fill"></i> {driverForm.id ? 'Edit Driver' : 'Add New Driver'}</h3>
                <button className="close-btn" onClick={() => setShowDriverForm(false)}><i className="ri-close-line"></i></button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company <span className="required">*</span></label>
                    <select value={driverForm.companyId} onChange={e => setDriverForm({...driverForm, companyId: parseInt(e.target.value)})}>
                      {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Cab Number <span className="required">*</span></label>
                    <input type="text" value={driverForm.cabNo} onChange={e => setDriverForm({...driverForm, cabNo: e.target.value})} placeholder="e.g., CAB-1" />
                  </div>
                  <div className="form-group">
                    <label>Driver Name <span className="required">*</span></label>
                    <input type="text" value={driverForm.driverName} onChange={e => setDriverForm({...driverForm, driverName: e.target.value})} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label>Driver Mobile <span className="required">*</span></label>
                    <input type="tel" value={driverForm.driverMobile} onChange={e => setDriverForm({...driverForm, driverMobile: e.target.value})} placeholder="10-digit mobile" maxLength="10" />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Number</label>
                    <input type="text" value={driverForm.vehicleNo} onChange={e => setDriverForm({...driverForm, vehicleNo: e.target.value.toUpperCase()})} placeholder="e.g., UP32TN5393" />
                  </div>
                  <div className="form-group">
                    <label>Driver Employee ID</label>
                    <input type="text" value={driverForm.driverEmpId} onChange={e => setDriverForm({...driverForm, driverEmpId: e.target.value})} placeholder="e.g., UC-0009" />
                  </div>
                  <div className="form-group">
                    <label>Vendor Name</label>
                    <input type="text" value={driverForm.vendorName} onChange={e => setDriverForm({...driverForm, vendorName: e.target.value})} placeholder="e.g., Union Services" />
                  </div>
                  <div className="form-group">
                    <label>Escort Name</label>
                    <input type="text" value={driverForm.escortName} onChange={e => setDriverForm({...driverForm, escortName: e.target.value})} placeholder="Escort full name" />
                  </div>
                  <div className="form-group">
                    <label>Escort Mobile</label>
                    <input type="tel" value={driverForm.escortMobile} onChange={e => setDriverForm({...driverForm, escortMobile: e.target.value})} placeholder="10-digit mobile" maxLength="10" />
                  </div>
                  <div className="form-group">
                    <label className={`checkbox-label ${driverForm.isActive ? 'checked' : ''}`}>
                      <input type="checkbox" checked={driverForm.isActive} onChange={e => setDriverForm({...driverForm, isActive: e.target.checked})} />
                      <span>Active</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowDriverForm(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSaveDriver} disabled={isSaving}>
                  {isSaving ? <Spinner size="sm" /> : <><i className="ri-save-line"></i> Save</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Employee Modal */}
        {showEmployeeForm && (
          <div className="modal-overlay" onClick={() => setShowEmployeeForm(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3><i className="ri-user-star-fill"></i> {employeeForm.id ? 'Edit Employee' : 'Add New Employee'}</h3>
                <button className="close-btn" onClick={() => setShowEmployeeForm(false)}><i className="ri-close-line"></i></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Company <span className="required">*</span></label>
                  <select value={employeeForm.companyId} onChange={e => setEmployeeForm({...employeeForm, companyId: parseInt(e.target.value), cabId: null})}>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Employee Name <span className="required">*</span></label>
                  <input type="text" value={employeeForm.name} onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})} placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label>Employee Code <span className="required">*</span></label>
                  <input type="text" value={employeeForm.empCode} onChange={e => setEmployeeForm({...employeeForm, empCode: e.target.value.toUpperCase()})} placeholder="e.g., EHS5665" />
                </div>
                <div className="form-group">
                  <label>Assigned Cab</label>
                  <select value={employeeForm.cabId || ''} onChange={e => setEmployeeForm({...employeeForm, cabId: e.target.value ? parseInt(e.target.value) : null})}>
                    <option value="">No Cab Assigned</option>
                    {drivers.filter(d => d.companyId === employeeForm.companyId).map(d => (
                      <option key={d.id} value={d.id}>{d.cabNo} - {d.driverName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className={`checkbox-label ${employeeForm.isActive ? 'checked' : ''}`}>
                    <input type="checkbox" checked={employeeForm.isActive} onChange={e => setEmployeeForm({...employeeForm, isActive: e.target.checked})} />
                    <span>Active</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowEmployeeForm(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSaveEmployee} disabled={isSaving}>
                  {isSaving ? <Spinner size="sm" /> : <><i className="ri-save-line"></i> Save</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="info-box">
          <div className="info-icon">📊</div>
          <div className="info-content">
            <h4>Google Sheets Integration</h4>
            <ul>
              <li>✅ All data is stored in Google Sheets (MASTER_COMPANIES, MASTER_DRIVERS, MASTER_EMPLOYEES)</li>
              <li>✅ Changes sync automatically to Google Sheets</li>
              <li>✅ GPS Tracking uses this data dynamically</li>
              <li>✅ Each company's trips go to their dedicated sheet</li>
              <li>✅ Click "Refresh Data" to get latest data from sheets</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminConfig;
