'use client'

import FileLoader from './components/FileLoader'
import FileSaver from './components/FileSaver'
import Editor from './components/Editor'
import { useState } from 'react'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap'

function UploadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 3v12m0-12l-4 4m4-4l4 4"
      />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 15V3m0 12l-4-4m4 4l4-4"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function EmptyState({
  setSaveData,
}: {
  setSaveData: React.Dispatch<React.SetStateAction<any>>
}) {
  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-panel2 text-signal">
          <UploadIcon />
        </div>
        <div>
          <h2 className="font-display font-semibold text-paper text-lg">
            No save file loaded
          </h2>
          <p className="mt-1 text-sm text-mist">
            Upload your Phasmophobia save to view and edit it. Nothing leaves
            your browser.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <label
            htmlFor="saveFileInput"
            className={`${buttonBase} bg-signal text-void hover:bg-signal/90`}
          >
            <UploadIcon />
            Upload Save File
          </label>
          <label
            htmlFor="saveFileInputUnencrypted"
            className={`${buttonBase} border border-line text-paper hover:border-mist`}
          >
            Upload Unencrypted JSON
          </label>
        </div>
        <FileLoader stateSetter={setSaveData} />
      </div>

      <div className="w-full rounded-lg border border-line bg-panel2 p-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-mist mb-3">
          &gt; Save file locations
        </p>
        <div className="flex flex-col gap-3 text-xs">
          <div>
            <p className="text-mist mb-1">Windows</p>
            <code className="block break-all rounded bg-void px-2 py-1.5 font-mono text-paper">
              %appdata%\..\LocalLow\Kinetic Games\Phasmophobia\SaveFile.txt
            </code>
          </div>
          <div>
            <p className="text-mist mb-1">Linux (Proton)</p>
            <code className="block break-all rounded bg-void px-2 py-1.5 font-mono text-paper">
              ~/.steam/steam/steamapps/compatdata/739630/pfx/drive_c/users/steamuser/AppData/LocalLow/Kinetic
              Games/Phasmophobia/SaveFile.txt
            </code>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-alert/90 max-w-sm">
        Disable Steam Cloud sync for Phasmophobia before editing, or Steam may
        overwrite your changes the next time you launch the game.
      </p>
    </div>
  )
}

function LoadedState({
  saveData,
  setSaveData,
}: {
  saveData: any
  setSaveData: React.Dispatch<React.SetStateAction<any>>
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="saveFileOutput"
          className={`${buttonBase} bg-signal text-void hover:bg-signal/90`}
        >
          <DownloadIcon />
          Download Save File
        </label>
        <label
          htmlFor="saveFileOutputUnencrypted"
          className={`${buttonBase} border border-line text-paper hover:border-mist`}
        >
          Download Unencrypted
        </label>
        <FileSaver data={saveData} />
        <label
          htmlFor="clearFile"
          className={`${buttonBase} ml-auto text-alert hover:bg-alert/10`}
        >
          <CloseIcon />
          Close file
        </label>
        <input
          type="button"
          id="clearFile"
          className="hidden"
          onClick={() => {
            setSaveData(null)
          }}
        />
      </div>

      <Editor data={saveData} onChange={setSaveData} />
    </div>
  )
}

export default function Home() {
  const [saveData, setSaveData] = useState(null)

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-5xl">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-scanlines opacity-40" />
        <div className="relative rounded-2xl border border-line bg-panel shadow-2xl shadow-black/60 overflow-hidden">
          <header className="flex items-center justify-between gap-4 border-b border-line bg-panel2 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  saveData ? 'bg-signal animate-blink' : 'bg-mist/30'
                }`}
                aria-hidden
              />
              <span className="font-mono text-[11px] uppercase tracking-widest text-mist">
                {saveData ? 'Signal locked' : 'No signal'}
              </span>
            </div>
            <h1 className="font-display font-bold text-base sm:text-lg tracking-tight text-paper">
              PHASMOEDITOR
            </h1>
          </header>

          <div className="p-5 sm:p-8">
            {saveData ? (
              <LoadedState saveData={saveData} setSaveData={setSaveData} />
            ) : (
              <EmptyState setSaveData={setSaveData} />
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-mist">
          Unofficial fan tool. Not affiliated with Kinetic Games.
        </p>
      </div>
    </main>
  )
}
