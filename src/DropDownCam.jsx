// src/DropDownCam.jsx
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useEffect } from 'react'
import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

export default function DropDownCam() {
  const [listaCamaras, setListaCamaras] = useState([]);
  const { webcams, changeWebcam, localParticipant } = useMeeting();
  const [camaraActiva, setCamaraActiva] = useState(null);

  useEffect(() => {
    // Obtener lista de webcams del sistema
    const obtenerWebcams = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
          setListaCamaras(videoDevices);
          setCamaraActiva(videoDevices[0]);
        }
      } catch (error) {
        console.warn("Error al obtener webcams:", error);
      }
    };
    
    obtenerWebcams();
  }, []);

  // Actualizar cuando cambian las webcams de VideoSDK
  useEffect(() => {
    if (webcams && Array.isArray(webcams) && webcams.length > 0) {
      setListaCamaras(webcams);
      setCamaraActiva(webcams[0]);
    }
  }, [webcams]);

  const cambiarCamara = async (deviceId) => {
    try {
      await changeWebcam(deviceId);
      const cam = listaCamaras.find(c => c.deviceId === deviceId);
      if (cam) setCamaraActiva(cam);
    } catch (error) {
      console.error("Error al cambiar cámara:", error);
    }
  };

  return (
    <div className="relative">
      <Popover className="relative w-48">
        {({ open }) => (
          <>
            <Popover.Button className={`focus:outline-none w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              open ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}>
              <div className="flex items-center gap-2 overflow-hidden">
                <span>📷</span>
                <span className="truncate max-w-[100px]">{camaraActiva?.label || "Cámara"}</span>
              </div>
              <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`} aria-hidden="true" />
            </Popover.Button>

            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
              <Popover.Panel className="absolute bottom-full mb-2 left-0 z-50 w-full bg-white border border-slate-100 rounded-xl shadow-2xl p-1.5">
                <div className="px-3 py-1.5 border-b border-slate-50 text-[10px] font-black text-slate-400 tracking-wider uppercase">Cámaras</div>
                <div className="max-h-48 overflow-y-auto">
                  {listaCamaras.length > 0 ? (
                    listaCamaras.map((camera, index) => (
                      <button 
                        key={`cam-${index}`} 
                        onClick={() => cambiarCamara(camera.deviceId)} 
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-semibold transition ${
                          camaraActiva?.deviceId === camera.deviceId ? "bg-sky-50 text-sky-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate pr-2">{camera.label || `Cámara ${index + 1}`}</span>
                        {camaraActiva?.deviceId === camera.deviceId && <CheckIcon className="h-4 w-4 text-sky-600 flex-shrink-0" />}
                      </button>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-400 p-3 text-center">No se detectaron cámaras</p>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}