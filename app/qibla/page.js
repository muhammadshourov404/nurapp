'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'
import {
  ChevronLeftIcon, MapPinIcon, RefreshIcon,
  CompassIcon, InfoIcon, CheckIcon
} from '../../components/Icons'

export default function QiblaPage() {
  const [qiblaAngle, setQiblaAngle] = useState(null)
  const [compassAngle, setCompassAngle] = useState(0)
  const [location, setLocation] = useState(null)
  const [cityName, setCityName] = useState('')
  const [status, setStatus] = useState('loading')
  const [lang, setLang] = useState('bn')
  const [compassEnabled, setCompassEnabled] = useState(false)
  const [distance, setDistance] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [aligned, setAligned] = useState(false)
  const orientationRef = useRef(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('nurapp_lang') || 'bn'
    setLang(savedLang)
    getLocation()
    return () => {
      if (orientationRef.current) {
        window.removeEventListener('deviceorientation', orientationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (qiblaAngle !== null) {
      const needle = ((qiblaAngle - compassAngle) % 360 + 360) % 360
      setAligned(needle < 5 || needle > 355)
    }
  }, [compassAngle, qiblaAngle])

  const getLocation = () => {
    setStatus('loading')
    navigator.geolocation?.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lon, accuracy: acc } = pos.coords
        setLocation({ lat, lon })
        setAccuracy(Math.round(acc))
        const angle = calculateQibla(lat, lon)
        setQiblaAngle(angle)
        const dist = calculateDistance(lat, lon, 21.4225, 39.8262)
        setDistance(Math.round(dist))
        setStatus('success')
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
          const data = await res.json()
          setCityName(data.address?.city || data.address?.town || data.address?.county || '')
        } catch {}
      },
      () => {
        const lat = 23.8103, lon = 90.4125
        setLocation({ lat, lon })
        setQiblaAngle(calculateQibla(lat, lon))
        setDistance(Math.round(calculateDistance(lat, lon, 21.4225, 39.8262)))
        setCityName(lang === 'bn' ? 'ঢাকা' : 'Dhaka')
        setStatus('default')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const enableCompass = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(r => {
          if (r === 'granted') {
            startCompass()
            setCompassEnabled(true)
          }
        }).catch(() => {})
    } else {
      startCompass()
      setCompassEnabled(true)
    }
  }

  const startCompass = () => {
    const handler = (e) => {
      if (e.webkitCompassHeading !== undefined) {
        setCompassAngle(e.webkitCompassHeading)
      } else if (e.alpha !== null) {
        setCompassAngle(360 - e.alpha)
      }
    }
    orientationRef.current = handler
    window.addEventListener('deviceorientation', handler, true)
  }

  const calculateQibla = (lat, lon) => {
    const KAABA_LAT = 21.4225
    const KAABA_LON = 39.8262
    const latR = lat * Math.PI / 180
    const lonR = lon * Math.PI / 180
    const kLatR = KAABA_LAT * Math.PI / 180
    const kLonR = KAABA_LON * Math.PI / 180
    const dLon = kLonR - lonR
    const y = Math.sin(dLon) * Math.cos(kLatR)
    const x = Math.cos(latR) * Math.sin(kLatR) - Math.sin(latR) * Math.cos(kLatR) * Math.cos(dLon)
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  const needleAngle = qiblaAngle !== null ? qiblaAngle - compassAngle : 0

  const toggleLang = () => {
    const nl = lang === 'bn' ? 'en' : 'bn'
    setLang(nl)
    localStorage.setItem('nurapp_lang', nl)
  }

  const getDirectionLabel = (angle) => {
    const dirs = lang === 'bn'
      ? ['উত্তর', 'উত্তর-পূর্ব', 'পূর্ব', 'দক্ষিণ-পূর্ব', 'দক্ষিণ', 'দক্ষিণ-পশ্চিম', 'পশ্চিম', 'উত্তর-পশ্চিম']
      : ['North', 'NE', 'East', 'SE', 'South', 'SW', 'West', 'NW']
    return dirs[Math.round(angle / 45) % 8]
  }

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>

      <header className="sticky top-0 z-50 header-blur">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-icon">
              <ChevronLeftIcon size={18} color="var(--text-secondary)" />
            </Link>
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'bn' ? 'কিবলা নির্দেশিকা' : 'Qibla Direction'}
              </h1>
              {cityName && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPinIcon size={10} color="#10b981" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{cityName}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={getLocation} className="btn-icon">
              <RefreshIcon size={16} color="var(--text-secondary)" />
            </button>
            <button onClick={toggleLang} className="btn-icon">
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? 'EN' : 'বাং'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 pt-5">

        {/* Info Cards Row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            {
              label: lang === 'bn' ? 'কিবলার দিক' : 'Qibla',
              value: qiblaAngle !== null ? `${Math.round(qiblaAngle)}°` : '--',
              sub: qiblaAngle !== null ? getDirectionLabel(qiblaAngle) : '',
              color: '#10b981'
            },
            {
              label: lang === 'bn' ? 'কাবা দূরত্ব' : 'Distance',
              value: distance ? `${distance.toLocaleString()}` : '--',
              sub: lang === 'bn' ? 'কিলোমিটার' : 'kilometers',
              color: '#f59e0b'
            },
            {
              label: lang === 'bn' ? 'নির্ভুলতা' : 'Accuracy',
              value: accuracy ? `±${accuracy}m` : (status === 'default' ? 'N/A' : '--'),
              sub: status === 'success' ? (lang === 'bn' ? 'GPS' : 'GPS') : (lang === 'bn' ? 'ডিফল্ট' : 'Default'),
              color: '#3b82f6'
            },
          ].map((info, i) => (
            <div key={i} className="card p-3 text-center">
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{info.label}</p>
              <p className="text-lg font-bold tabular-nums" style={{ color: info.color, fontFamily: 'Inter' }}>
                {info.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{info.sub}</p>
            </div>
          ))}
        </div>

        {/* Aligned Banner */}
        {aligned && compassEnabled && (
          <div className="rounded-2xl p-4 text-center mb-4 animate-scaleIn"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckIcon size={18} color="#10b981" />
              <p className="font-bold" style={{ color: '#10b981' }}>
                {lang === 'bn' ? 'আপনি কিবলামুখী!' : 'You are facing the Qibla!'}
              </p>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'bn' ? 'সামনে মক্কা শরীফ — বায়তুল্লাহ' : 'Makkah is ahead — Baytullah'}
            </p>
          </div>
        )}

        {/* Compass */}
        <div className="flex justify-center mb-5">
          <div className="relative" style={{ width: '280px', height: '280px' }}>

            {/* Outer glow */}
            {aligned && compassEnabled && (
              <div className="absolute inset-0 rounded-full animate-pulse-emerald"
                style={{ boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}></div>
            )}

            {/* Compass body */}
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'var(--bg-card)', border: `2px solid ${aligned && compassEnabled ? 'rgba(16,185,129,0.5)' : 'var(--border)'}`, transition: 'border-color 0.3s ease' }}>

              {/* Degree marks */}
              {Array.from({ length: 72 }).map((_, i) => (
                <div key={i} className="absolute w-full h-full flex justify-center"
                  style={{ transform: `rotate(${i * 5}deg)` }}>
                  <div className="mt-1.5" style={{
                    width: i % 18 === 0 ? '2px' : i % 9 === 0 ? '1px' : '1px',
                    height: i % 18 === 0 ? '18px' : i % 9 === 0 ? '10px' : '6px',
                    background: i % 18 === 0 ? 'rgba(16,185,129,0.7)' : i % 9 === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'
                  }}></div>
                </div>
              ))}

              {/* Cardinal directions */}
              {[
                { label: 'N', angle: 0, color: '#ef4444', bold: true },
                { label: 'E', angle: 90, color: 'var(--text-muted)', bold: false },
                { label: 'S', angle: 180, color: 'var(--text-muted)', bold: false },
                { label: 'W', angle: 270, color: 'var(--text-muted)', bold: false },
              ].map(d => (
                <div key={d.label} className="absolute inset-0 flex justify-center"
                  style={{ transform: `rotate(${d.angle}deg)` }}>
                  <span className="mt-7 text-xs"
                    style={{
                      color: d.color,
                      fontWeight: d.bold ? 800 : 600,
                      transform: `rotate(-${d.angle}deg)`,
                      fontFamily: 'Inter'
                    }}>
                    {d.label}
                  </span>
                </div>
              ))}

              {/* Qibla Needle */}
              {qiblaAngle !== null && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${needleAngle}deg)`, transition: compassEnabled ? 'transform 0.3s ease' : 'none' }}>

                  {/* Kaaba indicator (North/Qibla) */}
                  <div className="absolute flex flex-col items-center"
                    style={{ bottom: '50%', paddingBottom: '4px' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-1"
                      style={{
                        background: aligned && compassEnabled ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.2)',
                        border: `1px solid ${aligned && compassEnabled ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.3)'}`
                      }}>
                      <span style={{ fontSize: '16px' }}>🕋</span>
                    </div>
                    <div style={{
                      width: '3px',
                      height: '85px',
                      borderRadius: '3px',
                      background: aligned && compassEnabled
                        ? 'linear-gradient(to bottom, #10b981, #059669)'
                        : 'linear-gradient(to bottom, #fbbf24, #f59e0b)'
                    }}></div>
                  </div>

                  {/* South needle */}
                  <div className="absolute flex flex-col items-center"
                    style={{ top: '50%', paddingTop: '4px' }}>
                    <div style={{
                      width: '3px',
                      height: '65px',
                      borderRadius: '3px',
                      background: 'linear-gradient(to bottom, #ef4444, #dc2626)'
                    }}></div>
                  </div>
                </div>
              )}

              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full"
                  style={{
                    background: aligned && compassEnabled ? '#10b981' : 'var(--bg-card-hover)',
                    border: `2px solid ${aligned && compassEnabled ? '#34d399' : 'var(--border)'}`,
                    transition: 'all 0.3s ease',
                    boxShadow: aligned && compassEnabled ? '0 0 10px rgba(16,185,129,0.5)' : 'none'
                  }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enable Compass Button */}
        {!compassEnabled && (
          <button onClick={enableCompass}
            className="w-full rounded-2xl py-4 font-bold text-base text-white mb-4 transition-all active:scale-95 flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 8px 30px rgba(16,185,129,0.3)'
            }}>
            <CompassIcon size={20} color="white" />
            {lang === 'bn' ? 'লাইভ কম্পাস চালু করুন' : 'Enable Live Compass'}
          </button>
        )}

        {compassEnabled && !aligned && (
          <div className="rounded-2xl p-4 text-center mb-4"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
              {lang === 'bn' ? 'ফোন সমতলে ধরুন এবং ঘোরান' : 'Hold phone flat and rotate'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {lang === 'bn' ? 'যতক্ষণ না কম্পাস সবুজ হয়' : 'Until compass turns green'}
            </p>
          </div>
        )}

        {/* Info Cards */}
        <div className="space-y-3 mb-5">
          <div className="card p-4">
            <div className="flex items-start gap-3">
              <InfoIcon size={16} color="#10b981" />
              <div>
                <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'bn' ? 'কিভাবে ব্যবহার করবেন' : 'How to Use'}
                </p>
                <div className="space-y-1.5">
                  {(lang === 'bn' ? [
                    '১. "লাইভ কম্পাস চালু করুন" বাটনে ট্যাপ করুন',
                    '২. ফোনকে সমতলে ধরুন (মেঝে সমান্তরাল)',
                    '৩. ধীরে ধীরে ফোন ঘোরান',
                    '৪. কম্পাস সবুজ হলে কিবলামুখী হয়েছেন',
                  ] : [
                    '1. Tap "Enable Live Compass" button',
                    '2. Hold phone flat (parallel to ground)',
                    '3. Slowly rotate the phone',
                    '4. When compass turns green, you face Qibla',
                  ]).map((step, i) => (
                    <p key={i} className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4">
              <p className="text-xs font-bold mb-2" style={{ color: '#f59e0b' }}>
                {lang === 'bn' ? 'কাবা শরীফ' : 'Holy Kaaba'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>21.4225°N</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>39.8262°E</p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? 'মক্কা, সৌদি আরব' : 'Makkah, Saudi Arabia'}
              </p>
            </div>

            <div className="card p-4">
              <p className="text-xs font-bold mb-2" style={{ color: '#3b82f6' }}>
                {lang === 'bn' ? 'আপনার অবস্থান' : 'Your Location'}
              </p>
              {location ? (
                <>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{location.lat.toFixed(4)}°N</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{location.lon.toFixed(4)}°E</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {cityName || (lang === 'bn' ? 'অজানা' : 'Unknown')}
                  </p>
                </>
              ) : (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}
                </p>
              )}
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-start gap-3">
              <InfoIcon size={16} color="#f59e0b" />
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: '#f59e0b' }}>
                  {lang === 'bn' ? 'গুরুত্বপূর্ণ নোট' : 'Important Note'}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'bn'
                    ? 'ধাতব বস্তু, ইলেকট্রনিক ডিভাইস এবং চুম্বক থেকে দূরে রাখুন। কম্পাসের নির্ভুলতা পরিবেশের উপর নির্ভর করে।'
                    : 'Keep away from metal objects, electronic devices and magnets. Compass accuracy depends on environment.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {lang === 'bn' ? 'তৈরি করেছেন' : 'Developed by'}{' '}
            <span className="font-bold" style={{ color: '#10b981' }}>Muhammad Shourov</span>
          </p>
        </div>
      </div>

      <BottomNav lang={lang} />
    </main>
  )
}
