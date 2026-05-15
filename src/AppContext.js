import React, { createContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_FAMILY, PERIODS } from './constants';

export const AppContext = createContext({});

export function AppProvider({ children }) {
  const [family,    setFamily]    = useState(INITIAL_FAMILY);
  const [checked,   setChecked]   = useState({});
  const [nowTime,   setNowTime]   = useState('');
  const [alarmRing, setAlarmRing] = useState(null);
  const alarmRef = useRef({});

  /* ── persist ─────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@family_data');
        if (saved) setFamily(JSON.parse(saved));
        const savedChk = await AsyncStorage.getItem('@checked_data');
        if (savedChk) setChecked(JSON.parse(savedChk));
      } catch (e) { console.log('Load error', e); }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@family_data', JSON.stringify(family));
  }, [family]);

  useEffect(() => {
    AsyncStorage.setItem('@checked_data', JSON.stringify(checked));
  }, [checked]);

  /* ── clock ───────────────────────────────── */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh  = String(now.getHours()).padStart(2, '0');
      const mm  = String(now.getMinutes()).padStart(2, '0');
      setNowTime(`${hh}:${mm}`);
      family.members.forEach(m => {
        PERIODS.forEach(p => {
          if (m.alarms[p.id] === `${hh}:${mm}`) {
            const key = `${m.id}-${p.id}-${hh}:${mm}`;
            if (!alarmRef.current[key]) {
              alarmRef.current[key] = true;
              setAlarmRing({ member: m, period: p });
            }
          }
        });
      });
    };
    tick();
    const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, [family.members]);

  /* ── helpers ─────────────────────────────── */
  const updFamily  = (patch)    => setFamily(f => ({ ...f, ...patch }));
  const updMember  = (id, patch)=> setFamily(f => ({
    ...f,
    members: f.members.map(m => m.id === id ? { ...m, ...patch } : m),
  }));
  const addMember  = (m)        => setFamily(f => ({ ...f, members: [...f.members, m] }));
  const delMember  = (id)       => setFamily(f => ({ ...f, members: f.members.filter(m => m.id !== id) }));

  const getpts = (m) =>
    Object.keys(checked).filter(k => k.startsWith(`${m.id}-`) && checked[k]).length;

  const toggleCheck = (memberId, period, idx) => {
    const key = `${memberId}-${period}-${idx}`;
    setChecked(c => ({ ...c, [key]: !c[key] }));
    return !checked[key]; // returns new value
  };

  return (
    <AppContext.Provider value={{
      family, updFamily, updMember, addMember, delMember,
      checked, toggleCheck, getpts,
      nowTime, alarmRing, setAlarmRing,
    }}>
      {children}
    </AppContext.Provider>
  );
}
