import React, { useState, useEffect } from 'react';
import { PROVINCES, DISTRICTS, MUNICIPALITIES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface AddressSelectorProps {
  onAddressChange: (address: { province: string; district: string; municipality: string; ward: string }) => void;
  initialAddress?: { province: string; district: string; municipality: string; ward: string };
  isBilingual?: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onAddressChange, initialAddress, isBilingual = true }) => {
  const { t } = useLanguage();
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

  const selectClass = "w-full bg-white border border-slate-300 rounded-sm p-3 text-slate-800 focus:ring-1 focus:ring-[#0094da] focus:border-[#0094da] font-english disabled:bg-slate-100 disabled:text-slate-400";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

  const getLabel = (ne: string, en: string) => {
    if (isBilingual) return `${ne} (${en})`;
    return t(ne, en);
  };

  const getPlaceholder = () => {
     return isBilingual ? "छान्नुहोस् (Select)" : t("छान्नुहोस्", "Select");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className={labelClass}>{getLabel('प्रदेश', 'Province')}</label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className={selectClass}
          required
        >
          <option value="">{getPlaceholder()}</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{getLabel('जिल्ला', 'District')}</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          disabled={!province}
          className={selectClass}
          required
        >
          <option value="">{getPlaceholder()}</option>
          {availableDistricts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{getLabel('नगरपालिका / गाउँपालिका', 'Municipality')}</label>
        <select
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          disabled={!district}
          className={selectClass}
          required
        >
          <option value="">{getPlaceholder()}</option>
          {availableMunicipalities.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{getLabel('वडा नं.', 'Ward No.')}</label>
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          disabled={!municipality}
          className={selectClass}
          required
        >
          <option value="">{getPlaceholder()}</option>
          {[...Array(32)].map((_, i) => (
            <option key={i + 1} value={(i + 1).toString()}>{i + 1}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector;