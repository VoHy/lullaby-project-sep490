import React, { useEffect, useState } from "react";
import nursingSpecialists from '@/mock/NursingSpecialist';

export default function NursingSpecialistSelect({ zoneId, onSelectNurses }) {
  const [nurses, setNurses] = useState([]);
  const [selectedNurses, setSelectedNurses] = useState([]);

  useEffect(() => {
    setNurses(nursingSpecialists.filter(n => n.ZoneID === zoneId));
  }, [zoneId]);

  function toggleNurse(nurseId) {
    setSelectedNurses(prev =>
      prev.includes(nurseId)
        ? prev.filter(id => id !== nurseId)
        : [...prev, nurseId]
    );
  }

  useEffect(() => {
    onSelectNurses && onSelectNurses(selectedNurses);
  }, [selectedNurses, onSelectNurses]);

  return (
    <div>
      <h3>Chọn Y tá/Chuyên gia</h3>
      <ul>
        {nurses.map(n => (
          <li key={n.NursingID}>
            <label>
              <input
                type="checkbox"
                checked={selectedNurses.includes(n.NursingID)}
                onChange={() => toggleNurse(n.NursingID)}
              />
              {n.Nurse_Name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
} 