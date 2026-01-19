import React, { useState } from "react";
import { Form, Button, Spinner } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {googleSheetUrl} from "../urlandKeys"
import "../../src/styles/global.css";

// Driver and Cab Data with linked employees and escort
const driversData = [
  { 
    id: 1, 
    cabNo: "CAB-1", 
    driverName: "SIDDHARTH SINGH", 
    driverMobile: "6388499177", 
    driverEmpId: "UC-0009",
    vendorName: "Union Services", 
    vehicleNo: "UP32TN5393",
    escortId: 3, // DEEPAK YADAV
    employees: [
      { id: 1, name: "Sujata Sharma", mobile: "9554763649", location: "SAFEDABAD", time: "4:00PM" },
      { id: 2, name: "Swetha Pandey", mobile: "8919977434", location: "VIJYANT KHAND", time: "4:20PM" },
      { id: 3, name: "Veena Nigam", mobile: "8115499215", location: "Ismail Ganj", time: "4:40PM" },
    ]
  },
  { 
    id: 2, 
    cabNo: "CAB-2", 
    driverName: "RAHUL KASHYAP", 
    driverMobile: "7355713216", 
    driverEmpId: "UC-0008",
    vendorName: "Union Services", 
    vehicleNo: "UP32ZN7576",
    escortId: 2, // ANUJ SINGH
    employees: [
      { id: 4, name: "Riya Kumari", mobile: "9682723081", location: "DUBAGGA", time: "4:00PM" },
      { id: 5, name: "Pragati Pandey", mobile: "8318225261", location: "JANKIPURAM", time: "4:30PM" },
      { id: 6, name: "Ananya Singh", mobile: "9076977449", location: "JANKIPURAM", time: "4:45PM" },
    ]
  },
  { 
    id: 3, 
    cabNo: "CAB-3", 
    driverName: "FAIZ KHAN", 
    driverMobile: "6388320195", 
    driverEmpId: "UC-0007",
    vendorName: "Union Services", 
    vehicleNo: "UP32TN4911",
    escortId: 1, // DHEERAJ RATHORE
    employees: [
      { id: 7, name: "Reet Tandon", mobile: "8707755900", location: "CHOWK", time: "3:30PM" },
      { id: 8, name: "Anamika Rani", mobile: "9608028357", location: "DUBAGGA", time: "3:50PM" },
      { id: 9, name: "Garima Singh", mobile: "8840026499", location: "PATEL NAGAR", time: "4:10PM" },
    ]
  },
];

// All Employees Data (for dropdown)
const employeesData = [
  { id: 1, name: "Sujata Sharma", empId: "EMP01-9554763649", cabId: 1 },
  { id: 2, name: "Swetha Pandey", empId: "EMP02-8919977434", cabId: 1 },
  { id: 3, name: "Veena Nigam", empId: "EMP03-8115499215", cabId: 1 },
  { id: 4, name: "Riya Kumari", empId: "EMP04-9682723081", cabId: 2 },
  { id: 5, name: "Pragati Pandey", empId: "EMP05-8318225261", cabId: 2 },
  { id: 6, name: "Ananya Singh", empId: "EMP06-9076977449", cabId: 2 },
  { id: 7, name: "Reet Tandon", empId: "EMP07-8707755900", cabId: 3 },
  { id: 8, name: "Anamika Rani", empId: "EMP08-9608028357", cabId: 3 },
  { id: 9, name: "Garima Singh", empId: "EMP09-8840026499", cabId: 3 },
];

// Location Options (from actual data)
const locationOptions = [
  "CHOWK", "DUBAGGA", "PATEL NAGAR", "JANKIPURAM", "SAFEDABAD", 
  "VIJYANT KHAND", "Ismail Ganj", "Bhavya Tower", "ECLAT Office"
];

// Time Options (from actual data)
const timeOptions = [
  "3:30PM", "3:50PM", "4:00PM", "4:10PM", "4:20PM", "4:30PM", "4:40PM", "4:45PM"
];

// Helper function to convert 24-hour format (HH:MM) to 12-hour format (H:MMAM/PM)
const formatTimeTo12Hour = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes}${ampm}`;
};

// Shift Options
const shiftOptions = [
  "Shift 1 (06:30PM - 3:30AM)",
  "Shift 2 (09:00PM - 6:00AM)",
  "Morning (6AM - 2PM)",
  "Afternoon (2PM - 10PM)",
  "General (9AM - 6PM)",
  "Full Day"
];

// Trip Type Options
const tripTypeOptions = ["PU (Pick-Up)", "DO (Drop-Off)", "PU/DO (Both)"];

// Escort Data (linked to cab)
const escortsData = [
  { id: 1, name: "DHEERAJ RATHORE", mobile: "7275003552", empId: "UC-0010", cabId: 3 },
  { id: 2, name: "ANUJ SINGH", mobile: "9936892195", empId: "UC-0011", cabId: 2 },
  { id: 3, name: "DEEPAK YADAV", mobile: "9369510161", empId: "UC-0012", cabId: 1 },
];

const CabDetailsForm = () => {
  const generateTripId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TRP${year}${month}${day}${random}`;
  };

  const [formData, setFormData] = useState({
    DATE: new Date().toISOString().split('T')[0],
    TRIPID: generateTripId(),
    CABNO: "", VEHICLENO: "", VENDORNAME: "", DRIVERNAME: "", DRIVERMOBILE: "",
    ESCORTNAME: "", ESCORTIDMOBILE: "", TRIPTYPE: "",
    PICKUPLOCATION: [], PICKUPTIME: [], PICKUPMETERREADING: "",
    DROPOFFLOCATION: [], DROPOFFTIME: [], DROPOFFMETERREADING: "",
    TOTALKM: "", SHIFTTIMING: "", GPSENABLED: "", DELAY: "", REMARKS: "",
  });

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedEscort, setSelectedEscort] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown visibility states
  const [dropdowns, setDropdowns] = useState({
    driver: false, employee: false, escort: false, pickupLoc: false, dropoffLoc: false,
    pickupTime: false, dropoffTime: false, tripType: false, shift: false
  });
  
  // Other/Custom states
  const [showOther, setShowOther] = useState({
    driver: false, escort: false, tripType: false, shift: false
  });
  
  const [customValues, setCustomValues] = useState({
    tripType: "", shift: ""
  });

  const toggleDropdown = (name) => {
    setDropdowns(prev => {
      const newState = { driver: false, employee: false, escort: false, pickupLoc: false, dropoffLoc: false, pickupTime: false, dropoffTime: false, tripType: false, shift: false };
      newState[name] = !prev[name];
      return newState;
    });
  };

  // Handle Escort Selection
  const handleEscortChange = (escortId) => {
    if (escortId === "other") {
      setShowOther(prev => ({ ...prev, escort: true }));
      setSelectedEscort(null);
      setFormData(prev => ({ ...prev, ESCORTNAME: "", ESCORTIDMOBILE: "" }));
    } else if (escortId === "none") {
      setShowOther(prev => ({ ...prev, escort: false }));
      setSelectedEscort(null);
      setFormData(prev => ({ ...prev, ESCORTNAME: "", ESCORTIDMOBILE: "" }));
    } else if (escortId) {
      setShowOther(prev => ({ ...prev, escort: false }));
      const escort = escortsData.find(e => e.id === parseInt(escortId));
      if (escort) {
        setSelectedEscort(escort);
        setFormData(prev => ({
          ...prev, 
          ESCORTNAME: escort.name, 
          ESCORTIDMOBILE: `${escort.mobile} (${escort.empId})`
        }));
      }
    }
    toggleDropdown('escort');
  };

  const handleDriverChange = (driverId) => {
    if (driverId === "other") {
      setShowOther(prev => ({ ...prev, driver: true, escort: true }));
      setFormData(prev => ({ 
        ...prev, 
        CABNO: "", VEHICLENO: "", VENDORNAME: "Union Services", DRIVERNAME: "", DRIVERMOBILE: "", 
        ESCORTNAME: "", ESCORTIDMOBILE: "",
        PICKUPLOCATION: [], PICKUPTIME: [], DROPOFFLOCATION: [], DROPOFFTIME: []
      }));
      setSelectedEmployees([]);
      setSelectedEscort(null);
    } else if (driverId) {
      setShowOther(prev => ({ ...prev, driver: false, escort: false }));
      const driver = driversData.find(d => d.id === parseInt(driverId));
      if (driver) {
        // Get linked employees with their locations and times
        const linkedEmployees = employeesData.filter(e => e.cabId === driver.id);
        
        // Extract unique locations and times from linked employees
        const linkedLocations = driver.employees ? driver.employees.map(e => e.location) : [];
        const linkedTimes = driver.employees ? driver.employees.map(e => e.time) : [];
        
        // Auto-populate driver details and locations/times
        setFormData(prev => ({
          ...prev, 
          CABNO: driver.cabNo, 
          VEHICLENO: driver.vehicleNo,
          VENDORNAME: driver.vendorName, 
          DRIVERNAME: driver.driverName, 
          DRIVERMOBILE: driver.driverMobile,
          PICKUPLOCATION: linkedLocations,
          PICKUPTIME: linkedTimes,
          DROPOFFLOCATION: linkedLocations, // Same as pickup locations
          DROPOFFTIME: linkedTimes
        }));
        
        // Auto-populate linked employees
        setSelectedEmployees(linkedEmployees);
        
        // Auto-populate linked escort
        const linkedEscort = escortsData.find(e => e.id === driver.escortId);
        if (linkedEscort) {
          setSelectedEscort(linkedEscort);
          setFormData(prev => ({
            ...prev,
            ESCORTNAME: linkedEscort.name,
            ESCORTIDMOBILE: `${linkedEscort.mobile} (${linkedEscort.empId})`
          }));
        }
      }
    }
    toggleDropdown('driver');
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => {
      const arr = prev[field];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const handleEmployeeToggle = (emp) => {
    setSelectedEmployees(prev => {
      const exists = prev.find(e => e.id === emp.id);
      return exists ? prev.filter(e => e.id !== emp.id) : [...prev, emp];
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'PICKUPMETERREADING' || name === 'DROPOFFMETERREADING') {
      const pickup = name === 'PICKUPMETERREADING' ? Number(value) : Number(formData.PICKUPMETERREADING);
      const dropoff = name === 'DROPOFFMETERREADING' ? Number(value) : Number(formData.DROPOFFMETERREADING);
      setFormData(prev => ({ ...prev, [name]: value, TOTALKM: dropoff && pickup ? String(dropoff - pickup) : "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formDataObj = new FormData();
    Object.entries({
      ...formData,
      EMPLOYEENAME: selectedEmployees.map(e => e.name).join(', '),
      EMPID: selectedEmployees.map(e => e.empId).join(', '),
      PICKUPLOCATION: formData.PICKUPLOCATION.join(', '),
      PICKUPTIME: formData.PICKUPTIME.join(', '),
      DROPOFFLOCATION: formData.DROPOFFLOCATION.join(', '),
      DROPOFFTIME: formData.DROPOFFTIME.join(', ')
    }).forEach(([key, val]) => formDataObj.append(key, val));

    try {
      const response = await fetch(googleSheetUrl, { method: "POST", body: formDataObj });
      if (response.ok) {
        toast.success('✅ Cab Details Submitted Successfully!');
        // Reset
        setFormData({
          DATE: new Date().toISOString().split('T')[0], TRIPID: generateTripId(),
          CABNO: "", VEHICLENO: "", VENDORNAME: "", DRIVERNAME: "", DRIVERMOBILE: "",
          ESCORTNAME: "", ESCORTIDMOBILE: "", TRIPTYPE: "",
          PICKUPLOCATION: [], PICKUPTIME: [], PICKUPMETERREADING: "",
          DROPOFFLOCATION: [], DROPOFFTIME: [], DROPOFFMETERREADING: "",
          TOTALKM: "", SHIFTTIMING: "", GPSENABLED: "", DELAY: "", REMARKS: "",
        });
        setSelectedEmployees([]);
        setSelectedEscort(null);
        setShowOther({ driver: false, escort: false, tripType: false, shift: false });
      } else {
        toast.error('❌ Submission failed: ' + response.statusText);
      }
    } catch (error) {
      toast.error('❌ Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => (
    formData.DATE && formData.CABNO && formData.DRIVERNAME && selectedEmployees.length > 0 &&
    formData.TRIPTYPE && formData.PICKUPLOCATION.length > 0 && formData.PICKUPTIME.length > 0 &&
    formData.DROPOFFLOCATION.length > 0 && formData.DROPOFFTIME.length > 0 && formData.SHIFTTIMING &&
    formData.GPSENABLED && formData.DELAY
  );

  // Styles
  const s = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '25px', fontFamily: "'Segoe UI', sans-serif" },
    section: { background: '#fff', borderRadius: '12px', padding: '25px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
    sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#000D6B', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #000D6B', display: 'flex', alignItems: 'center', gap: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    field: { marginBottom: '5px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '6px' },
    hint: { color: '#888', fontWeight: 'normal', fontSize: '11px' },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' },
    inputReadonly: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: '#f8f9fa', color: '#666', boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: '#fff', cursor: 'pointer', boxSizing: 'border-box' },
    dropBtn: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', boxSizing: 'border-box' },
    dropMenu: { position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '8px', marginTop: '4px', maxHeight: '220px', overflowY: 'auto', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    dropItem: { display: 'flex', alignItems: 'center', padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', fontSize: '14px', gap: '10px' },
    checkbox: { width: '16px', height: '16px', accentColor: '#000D6B', cursor: 'pointer', flexShrink: 0 },
    customBox: { padding: '10px 12px', borderTop: '1px solid #ddd', background: '#fafafa' },
    addBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    submitBtn: { background: 'linear-gradient(135deg, #000D6B, #1a237e)', color: '#fff', border: 'none', padding: '14px 50px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', width: '100%', maxWidth: '350px' },
    submitBtnDisabled: { background: '#aaa', cursor: 'not-allowed' }
  };

  // Reusable Dropdown Component - Tags shown inside the input field
  const Dropdown = ({ label, options, selected, onToggle, isOpen, setOpen, color, placeholder, onAddCustom, isEmployee, inputType = 'text', inputPlaceholder = 'Enter value' }) => {
    const [localCustomValue, setLocalCustomValue] = React.useState('');
    const [localCustomValue2, setLocalCustomValue2] = React.useState(''); // For employee ID
    const inputRef = React.useRef(null);
    const inputRef2 = React.useRef(null);

    const handleAddCustom = () => {
      if (isEmployee) {
        if (localCustomValue.trim() && localCustomValue2.trim()) {
          onAddCustom(localCustomValue.trim(), localCustomValue2.trim());
          setLocalCustomValue('');
          setLocalCustomValue2('');
        }
      } else {
        if (localCustomValue.trim()) {
          onAddCustom(localCustomValue.trim());
          setLocalCustomValue('');
        }
      }
    };

    return (
      <div style={{ ...s.field, position: 'relative' }}>
        <label style={s.label}>{label} <span style={s.hint}>(Multi-select)</span></label>
        
        {/* Input field with tags inside */}
        <div 
          onClick={() => setOpen(!isOpen)} 
          style={{
            width: '100%',
            minHeight: '42px',
            padding: '6px 35px 6px 10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '5px',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          {selected.length > 0 ? (
            selected.map((item, i) => (
              <span 
                key={i} 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  padding: '3px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  color: '#fff', 
                  fontWeight: '500',
                  background: color 
                }}
              >
                {isEmployee ? item.name : item}
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); onToggle(item); }} 
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: 0, lineHeight: 1 }}
                >×</button>
              </span>
            ))
          ) : (
            <span style={{ color: '#999', fontSize: '14px' }}>{placeholder}</span>
          )}
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#666' }}>
            {isOpen ? '▲' : '▼'}
          </span>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div style={{ ...s.dropMenu, maxHeight: 'none', overflow: 'visible', display: 'flex', flexDirection: 'column' }}>
            {/* Scrollable Options List */}
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {options.map((opt, i) => {
                const isSelected = isEmployee ? selected.some(s => s.id === opt.id) : selected.includes(opt);
                return (
                  <div key={i} style={{ ...s.dropItem, background: isSelected ? '#e8f4fc' : '#fff' }} onClick={() => onToggle(opt)}>
                    <input type="checkbox" checked={isSelected} readOnly style={s.checkbox} />
                    <span style={{ flex: 1 }}>{isEmployee ? opt.name : opt}</span>
                    {isEmployee && <span style={{ color: '#888', fontSize: '12px' }}>({opt.empId})</span>}
                  </div>
                );
              })}
            </div>
            {/* Fixed Custom Input Section */}
            <div 
              style={{ ...s.customBox, position: 'sticky', bottom: 0, background: '#fafafa', borderTop: '2px solid #000D6B' }} 
              onClick={(e) => e.stopPropagation()} 
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: '600' }}>➕ Add Custom</div>
              {isEmployee ? (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={localCustomValue} 
                    onChange={e => setLocalCustomValue(e.target.value)} 
                    onClick={e => e.stopPropagation()} 
                    onMouseDown={e => e.stopPropagation()}
                    placeholder="Name" 
                    style={{ ...s.input, flex: 1, minWidth: '100px' }} 
                  />
                  <input 
                    ref={inputRef2}
                    type="text" 
                    value={localCustomValue2} 
                    onChange={e => setLocalCustomValue2(e.target.value)} 
                    onClick={e => e.stopPropagation()} 
                    onMouseDown={e => e.stopPropagation()}
                    placeholder="ID" 
                    style={{ ...s.input, width: '80px' }} 
                  />
                </div>
              ) : (
                <input 
                  ref={inputRef}
                  type={inputType} 
                  value={localCustomValue} 
                  onChange={e => setLocalCustomValue(e.target.value)} 
                  onClick={e => e.stopPropagation()} 
                  onMouseDown={e => e.stopPropagation()}
                  placeholder={inputPlaceholder} 
                  style={s.input} 
                />
              )}
              <button type="button" onClick={(e) => { e.stopPropagation(); handleAddCustom(); }} style={{ ...s.addBtn, marginTop: '6px' }}>Add</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <CommonSection title="Driver Cab Details" />
      <Form style={s.container} onSubmit={handleSubmit}>
        
        {/* Trip Info */}
        <div style={s.section}>
          <div style={s.sectionTitle}>📋 Trip Information</div>
          <div style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>Date</label>
              <input type="date" name="DATE" value={formData.DATE} onChange={handleInputChange} style={s.input} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Trip ID</label>
              <input type="text" value={formData.TRIPID} readOnly style={s.inputReadonly} />
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div style={s.section}>
          <div style={s.sectionTitle}>🚗 Driver & Vehicle</div>
          <div style={s.grid}>
            <div style={{ ...s.field, position: 'relative' }}>
              <label style={s.label}>Select Driver/Cab</label>
              <button type="button" onClick={() => toggleDropdown('driver')} style={s.dropBtn}>
                <span style={{ color: formData.DRIVERNAME ? '#333' : '#999' }}>
                  {formData.DRIVERNAME ? `${formData.CABNO} - ${formData.DRIVERNAME}` : '-- Select Driver --'}
                </span>
                <span>{dropdowns.driver ? '▲' : '▼'}</span>
              </button>
              {dropdowns.driver && (
                <div style={s.dropMenu}>
                  {driversData.map(d => (
                    <div key={d.id} style={{ ...s.dropItem, background: formData.DRIVERNAME === d.driverName ? '#e8f4fc' : '#fff' }} onClick={() => handleDriverChange(d.id)}>
                      <strong>{d.cabNo}</strong> - {d.driverName} <span style={{ color: '#888' }}>({d.vehicleNo})</span>
                    </div>
                  ))}
                  <div style={{ ...s.dropItem, color: '#000D6B', fontWeight: '600' }} onClick={() => handleDriverChange('other')}>
                    🔧 Other (Enter Manually)
                  </div>
                </div>
              )}
            </div>
            
            {showOther.driver ? (
              <>
                <div style={s.field}>
                  <label style={s.label}>Cab No</label>
                  <input type="text" name="CABNO" value={formData.CABNO} onChange={handleInputChange} placeholder="e.g., CAB-4" style={s.input} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Vehicle No</label>
                  <input type="text" name="VEHICLENO" value={formData.VEHICLENO} onChange={handleInputChange} placeholder="e.g., UP32XX1234" style={s.input} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Driver Name</label>
                  <input type="text" name="DRIVERNAME" value={formData.DRIVERNAME} onChange={handleInputChange} placeholder="Enter name" style={s.input} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Driver Mobile</label>
                  <input type="text" name="DRIVERMOBILE" value={formData.DRIVERMOBILE} onChange={handleInputChange} placeholder="Enter mobile" style={s.input} maxLength="10" />
                </div>
              </>
            ) : (
              <>
                <div style={s.field}>
                  <label style={s.label}>Cab No / Vehicle No</label>
                  <input type="text" value={formData.CABNO ? `${formData.CABNO} / ${formData.VEHICLENO}` : ''} readOnly style={s.inputReadonly} placeholder="Auto-filled" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Driver Name</label>
                  <input type="text" value={formData.DRIVERNAME} readOnly style={s.inputReadonly} placeholder="Auto-filled" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Driver Mobile</label>
                  <input type="text" value={formData.DRIVERMOBILE} readOnly style={s.inputReadonly} placeholder="Auto-filled" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Escort & Employee */}
        <div style={s.section}>
          <div style={s.sectionTitle}>👥 Escort & Employee Details</div>
          <div style={s.grid}>
            {/* Escort Dropdown */}
            <div style={{ ...s.field, position: 'relative' }}>
              <label style={s.label}>Select Escort <span style={s.hint}>(Optional)</span></label>
              <button type="button" onClick={() => toggleDropdown('escort')} style={s.dropBtn}>
                <span style={{ color: selectedEscort ? '#333' : '#999' }}>
                  {selectedEscort ? `${selectedEscort.name} - ${selectedEscort.mobile}` : '-- Select Escort --'}
                </span>
                <span>{dropdowns.escort ? '▲' : '▼'}</span>
              </button>
              {dropdowns.escort && (
                <div style={s.dropMenu}>
                  <div style={{ ...s.dropItem, color: '#888' }} onClick={() => handleEscortChange('none')}>
                    -- No Escort --
                  </div>
                  {escortsData.map(e => (
                    <div key={e.id} style={{ ...s.dropItem, background: selectedEscort?.id === e.id ? '#e8f4fc' : '#fff' }} onClick={() => handleEscortChange(e.id)}>
                      <strong>{e.name}</strong> - {e.mobile} <span style={{ color: '#888', fontSize: '12px' }}>({e.empId})</span>
                    </div>
                  ))}
                  <div style={{ ...s.dropItem, color: '#000D6B', fontWeight: '600' }} onClick={() => handleEscortChange('other')}>
                    🔧 Other (Enter Manually)
                  </div>
                </div>
              )}
            </div>

            {/* Escort Details - Auto-filled or Manual */}
            {showOther.escort ? (
              <>
                <div style={s.field}>
                  <label style={s.label}>Escort Name</label>
                  <input type="text" name="ESCORTNAME" value={formData.ESCORTNAME} onChange={handleInputChange} placeholder="Enter escort name" style={s.input} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Escort ID/Mobile</label>
                  <input type="text" name="ESCORTIDMOBILE" value={formData.ESCORTIDMOBILE} onChange={handleInputChange} placeholder="Enter ID or mobile" style={s.input} />
                </div>
              </>
            ) : selectedEscort && (
              <div style={s.field}>
                <label style={s.label}>Escort ID/Mobile</label>
                <input type="text" value={formData.ESCORTIDMOBILE} readOnly style={s.inputReadonly} />
              </div>
            )}
            
            <Dropdown
              label="Employee Name & ID"
              options={employeesData}
              selected={selectedEmployees}
              onToggle={handleEmployeeToggle}
              isOpen={dropdowns.employee}
              setOpen={() => toggleDropdown('employee')}
              color="#6f42c1"
              placeholder="Select employees..."
              isEmployee={true}
              onAddCustom={(name, id) => setSelectedEmployees(prev => [...prev, { id: Date.now(), name, empId: id }])}
            />
          </div>
        </div>

        {/* Trip Type & Location */}
        <div style={s.section}>
          <div style={s.sectionTitle}>📍 Trip Details</div>
          <div style={s.grid}>
            <div style={{ ...s.field, position: 'relative' }}>
              <label style={s.label}>Trip Type (PU/DO)</label>
              <button type="button" onClick={() => toggleDropdown('tripType')} style={s.dropBtn}>
                <span style={{ color: formData.TRIPTYPE ? '#333' : '#999' }}>{formData.TRIPTYPE || '-- Select Trip Type --'}</span>
                <span>{dropdowns.tripType ? '▲' : '▼'}</span>
              </button>
              {dropdowns.tripType && (
                <div style={s.dropMenu}>
                  {tripTypeOptions.map((t, i) => (
                    <div key={i} style={{ ...s.dropItem, background: formData.TRIPTYPE === t ? '#e8f4fc' : '#fff' }} onClick={() => { setFormData(p => ({ ...p, TRIPTYPE: t })); setShowOther(p => ({ ...p, tripType: false })); toggleDropdown('tripType'); }}>
                      {t}
                    </div>
                  ))}
                  <div style={{ ...s.dropItem, color: '#000D6B', fontWeight: '600' }} onClick={() => { setShowOther(p => ({ ...p, tripType: true })); toggleDropdown('tripType'); }}>
                    🔧 Other
                  </div>
                </div>
              )}
              {showOther.tripType && (
                <input type="text" value={customValues.tripType} onChange={e => { setCustomValues(p => ({ ...p, tripType: e.target.value })); setFormData(p => ({ ...p, TRIPTYPE: e.target.value })); }} placeholder="Enter trip type" style={{ ...s.input, marginTop: '8px' }} />
              )}
            </div>

            <Dropdown
              label="Pick-Up Location"
              options={locationOptions}
              selected={formData.PICKUPLOCATION}
              onToggle={(loc) => handleArrayToggle('PICKUPLOCATION', loc)}
              isOpen={dropdowns.pickupLoc}
              setOpen={() => toggleDropdown('pickupLoc')}
              color="#000D6B"
              placeholder="Select locations..."
              inputType="text"
              inputPlaceholder="Enter location"
              onAddCustom={(val) => setFormData(prev => ({ ...prev, PICKUPLOCATION: [...prev.PICKUPLOCATION, val] }))}
            />

            <Dropdown
              label="Pick-Up Time"
              options={timeOptions}
              selected={formData.PICKUPTIME}
              onToggle={(t) => handleArrayToggle('PICKUPTIME', t)}
              isOpen={dropdowns.pickupTime}
              setOpen={() => toggleDropdown('pickupTime')}
              color="#17a2b8"
              placeholder="Select times..."
              inputType="time"
              inputPlaceholder="Select time"
              onAddCustom={(val) => {
                const formattedTime = formatTimeTo12Hour(val);
                if (formattedTime && !formData.PICKUPTIME.includes(formattedTime)) {
                  setFormData(prev => ({ ...prev, PICKUPTIME: [...prev.PICKUPTIME, formattedTime] }));
                }
              }}
            />
          </div>
          
          <div style={{ ...s.grid, marginTop: '15px' }}>
            <Dropdown
              label="Drop-Off Location"
              options={locationOptions}
              selected={formData.DROPOFFLOCATION}
              onToggle={(loc) => handleArrayToggle('DROPOFFLOCATION', loc)}
              isOpen={dropdowns.dropoffLoc}
              setOpen={() => toggleDropdown('dropoffLoc')}
              color="#dc3545"
              placeholder="Select locations..."
              inputType="text"
              inputPlaceholder="Enter location"
              onAddCustom={(val) => setFormData(prev => ({ ...prev, DROPOFFLOCATION: [...prev.DROPOFFLOCATION, val] }))}
            />

            <Dropdown
              label="Drop-Off Time"
              options={timeOptions}
              selected={formData.DROPOFFTIME}
              onToggle={(t) => handleArrayToggle('DROPOFFTIME', t)}
              isOpen={dropdowns.dropoffTime}
              setOpen={() => toggleDropdown('dropoffTime')}
              color="#e83e8c"
              placeholder="Select times..."
              inputType="time"
              inputPlaceholder="Select time"
              onAddCustom={(val) => {
                const formattedTime = formatTimeTo12Hour(val);
                if (formattedTime && !formData.DROPOFFTIME.includes(formattedTime)) {
                  setFormData(prev => ({ ...prev, DROPOFFTIME: [...prev.DROPOFFTIME, formattedTime] }));
                }
              }}
            />
          </div>
        </div>

        {/* Meter & Other */}
        <div style={s.section}>
          <div style={s.sectionTitle}>📊 Meter & Additional Info</div>
          <div style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>Pick-Up Meter Reading (KM)</label>
              <input type="number" name="PICKUPMETERREADING" value={formData.PICKUPMETERREADING} onChange={handleInputChange} placeholder="Enter KM" style={s.input} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Drop-Off Meter Reading (KM)</label>
              <input type="number" name="DROPOFFMETERREADING" value={formData.DROPOFFMETERREADING} onChange={handleInputChange} placeholder="Enter KM" style={s.input} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Total KM</label>
              <input type="text" value={formData.TOTALKM} readOnly style={s.inputReadonly} placeholder="Auto-calculated" />
            </div>
            
            <div style={{ ...s.field, position: 'relative' }}>
              <label style={s.label}>Shift Timing</label>
              <button type="button" onClick={() => toggleDropdown('shift')} style={s.dropBtn}>
                <span style={{ color: formData.SHIFTTIMING ? '#333' : '#999' }}>{formData.SHIFTTIMING || '-- Select Shift --'}</span>
                <span>{dropdowns.shift ? '▲' : '▼'}</span>
              </button>
              {dropdowns.shift && (
                <div style={s.dropMenu}>
                  {shiftOptions.map((sh, i) => (
                    <div key={i} style={{ ...s.dropItem, background: formData.SHIFTTIMING === sh ? '#e8f4fc' : '#fff' }} onClick={() => { setFormData(p => ({ ...p, SHIFTTIMING: sh })); setShowOther(p => ({ ...p, shift: false })); toggleDropdown('shift'); }}>
                      {sh}
                    </div>
                  ))}
                  <div style={{ ...s.dropItem, color: '#000D6B', fontWeight: '600' }} onClick={() => { setShowOther(p => ({ ...p, shift: true })); toggleDropdown('shift'); }}>
                    🔧 Other
                  </div>
                </div>
              )}
              {showOther.shift && (
                <input type="text" value={customValues.shift} onChange={e => { setCustomValues(p => ({ ...p, shift: e.target.value })); setFormData(p => ({ ...p, SHIFTTIMING: e.target.value })); }} placeholder="Enter shift timing" style={{ ...s.input, marginTop: '8px' }} />
              )}
            </div>

            <div style={s.field}>
              <label style={s.label}>GPS Enabled (Y/N)</label>
              <select name="GPSENABLED" value={formData.GPSENABLED} onChange={handleInputChange} style={s.select} required>
                <option value="">-- Select --</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Delay (Y/N)</label>
              <select name="DELAY" value={formData.DELAY} onChange={handleInputChange} style={s.select} required>
                <option value="">-- Select --</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>
            <div style={{ ...s.field, gridColumn: '1 / -1' }}>
              <label style={s.label}>Remarks <span style={s.hint}>(Optional)</span></label>
              <input type="text" name="REMARKS" value={formData.REMARKS} onChange={handleInputChange} placeholder="Any additional notes..." style={s.input} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Button type="submit" disabled={!isFormValid() || isLoading} style={isFormValid() ? s.submitBtn : { ...s.submitBtn, ...s.submitBtnDisabled }}>
            {isLoading ? <><Spinner size="sm" /> Submitting...</> : '💾 Submit Cab Details'}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CabDetailsForm;
