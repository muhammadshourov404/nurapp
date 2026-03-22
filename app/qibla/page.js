'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function QiblaPage() {
  const [qiblaAngle, setQiblaAngle] = useState(null)
  const [compassAngle, setCompassAngle] = useState(0)
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('loading')
  const [lang, setLang] = useState('bn')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setLocation({ lat: latitude, lon: longitude })
          const angle = calculateQibla(latitude, longitude)
          setQiblaAngle(angle)
          setStatus('success')
        },
        () => {
          // Default to Dhaka
          const angle = calculateQibla(23.8103, 90.4125)
          setQiblaAngle(angle)
          setLocation({ lat: 23.8103, lon: 90.4125 })
          setStatus('default')
        }
      )
    }

    // Compass
    const handleOrientation = (e) => {
      if (e.alpha !== null) {
        setCompassAngle(e.alpha)
      }
    }

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(r => { if (r === 'granted') window.addEventListener('deviceorientation', handleOrientation) })
          .catch(() => {})
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])

  const calculateQibla = (lat, lon) => {
    const KAABA_LAT = 21.4225
    const KAABA_LON = 39.8262
    const latRad = lat * Math.PI / 180
    const lonRad = lon * Math.PI / 180
    const kaabaLatRad = KAABA_LAT * Math.PI / 180
    const kaabaLonRad = KAABA_LON * Math.PI / 180
    const dLon = kaabaLonRad - lonRad
    const y = Math.sin(dLon) * Math.cos(kaabaLatRad)
    const x = Math.cos(latRad) * Math.sin(kaabaLatRad) -
              Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(dLon)
    const angle = Math.atan2(y, x) * 180 / Math.PI
    return (angle + 360) % 360
  }

  const needleRotation = qiblaAngle !== null ? qiblaAngle - compassAngle : 0

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/nurapp" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              ←
            </Link>
            <h1 className="text-lg font-bold text-white">
              {lang === 'bn' ? '🧭 কিবলা দিকনির্দেশ' : '🧭 Qibla Direction'}
            </h1>
          </div>
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-all"
          >
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Info Card */}
        <div className="rounded-2xl gradient-green p-5 text-center mb-8">
          <p className="text-emerald-200 text-sm mb-1">
            {lang === 'bn' ? '📍 আপনার অবস্থান' : '📍 Your Location'}
          </p>
          {location && (
            <p className="text-white font-bold">
              {status === 'default'
                ? (lang === 'bn' ? 'ঢাকা, বাংলাদেশ (ডিফল্ট)' : 'Dhaka, Bangladesh (Default)')
                : `${location.lat.toFixed(4)}°N, ${location.lon.toFixed(4)}°E`}
            </p>
          )}
          {qiblaAngle !== null && (
            <p className="text-amber-300 text-sm mt-2">
              {lang === 'bn' ? `কিবলার দিক: ${Math.round(qiblaAngle)}°` : `Qibla Direction: ${Math.round(qiblaAngle)}°`}
            </p>
          )}
        </div>

        {/* Compass */}
        <div className="flex justify-center mb-8">
          <div className="relative w-72 h-72">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600/30 bg-gray-900 shadow-2xl">
              {/* Direction Labels */}
              {[
                { label: 'N', top: '4px', left: '50%', transform: 'translateX(-50%)' },
                { label: 'S', bottom: '4px', left: '50%', transform: 'translateX(-50%)' },
                { label: 'E', right: '4px', top: '50%', transform: 'translateY(-50%)' },
                { label: 'W', left: '4px', top: '50%', transform: 'translateY(-50%)' },
              ].map((d, i) => (
                <span
                  key={i}
                  className="absolute text-emerald-400 font-bold text-sm"
                  style={{ top: d.top, bottom: d.bottom, left: d.left, right: d.right, transform: d.transform }}
                >
                  {d.label}
                </span>
              ))}

              {/* Degree Marks */}
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-full"
                  style={{ transform: `rotate(${i * 10}deg)` }}
                >
                  <div className={`absolute top-2 left-1/2 -translate-x-1/2 bg-emerald-600/50 ${i % 9 === 0 ? 'w-0.5 h-4' : 'w-px h-2'}`}></div>
                </div>
              ))}

              {/* Qibla Needle */}
              {qiblaAngle !== null && (
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `rotate(${needleRotation}deg)` }}
                >
                  {/* Needle Up (Qibla) */}
                  <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="text-2xl">🕋</div>
                    <div className="w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"
                      style={{ height: '90px' }}
                    ></div>
                  </div>
                  {/* Needle Down */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
                    <div className="w-1 bg-gradient-to-b from-red-600 to-red-400 rounded-full"
                      style={{ height: '70px' }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Center Dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-emerald-400 text-xs font-bold mb-2">
              {lang === 'bn' ? '📱 কিভাবে ব্যবহার করবেন' : '📱 How to Use'}
            </p>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• {lang === 'bn' ? 'ফোনটি সমতলে ধরুন' : 'Hold your phone flat'}</li>
              <li>• {lang === 'bn' ? '🕋 চিহ্নটি যেদিকে সেদিকে মুখ করুন' : 'Face the direction of 🕋 symbol'}</li>
              <li>• {lang === 'bn' ? 'সেটিই কিবলার দিক' : 'That is the Qibla direction'}</li>
            </ul>
          </div>

          <div className="rounded-xl bg-amber-950/30 border border-amber-600/30 p-4">
            <p className="text-amber-400 text-xs font-bold mb-1">
              {lang === 'bn' ? '⚠️ দ্রষ্টব্য' : '⚠️ Note'}
            </p>
            <p className="text-gray-300 text-xs leading-relaxed">
              {lang === 'bn'
                ? 'কম্পাস সঠিকভাবে কাজ করতে ডিভাইসের অনুমতি প্রয়োজন। ধাতব বস্তু থেকে দূরে রাখুন।'
                : 'Compass needs device permission to work properly. Keep away from metal objects.'}
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
