import React, { useState, useEffect } from 'react';
import { PROVINCES, DISTRICTS, MUNICIPALITIES } from '../constants';

interface AddressSelectorProps {
  onAddressChange: (address: { province: string; district: string; municipality: string; ward: string }) => void;
  initialAddress?: { province: string; district: string; municipality: string; ward: string };
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onAddressChange, initialAddress }) => {
  const [province, setProvince] = useState(initialAddress?.province || '');
  const [district, setDistrict] = useState(initialAddress?.district || '');
  const [municipality, setMunicipality] = useState(initialAddress?.municipality || '');
  const [ward, setWard] = useState(initialAddress?.ward || '');

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (province && !DISTRICTS[province]?.includes(district)) {
        setDistrict('');
        setMunicipality('');
        setWard('');
    }
  }, [province, district]);

  useEffect(() => {
     if (district) {
         // Reset municipality if not valid for district (using simplified mock check)
         if (municipality && !(MUNICIPALITIES[district] || MUNICIPALITIES['Default']).includes(municipality)) {
             setMunicipality('');
             setWard('');
         }
     } else {
         setMunicipality('');
         setWard('');
     }
  }, [district, municipality]);


  useEffect(() => {
    onAddressChange({ province, district, municipality, ward });
  }, [province, district, municipality, ward, onAddressChange]);

  const availableDistricts = province ? DISTRICTS[province] || [] : [];
  const availableMunicipalities = district ? (MUNICIPALITIES[district] || MUNICIPALITIES['Default']) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Province</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          disabled={!province}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          required
        >
          <option value="">Select District</option>
          {availableDistricts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
        <select
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          disabled={!district}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          required
        >
          <option value="">Select Municipality</option>
          {availableMunicipalities.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ward No.</label>
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          disabled={!municipality}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          required
        >
          <option value="">Select Ward</option>
          {[...Array(32)].map((_, i) => (
            <option key={i + 1} value={(i + 1).toString()}>{i + 1}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector;