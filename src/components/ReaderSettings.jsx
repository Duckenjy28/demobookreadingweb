import { useContext } from 'react'
import { ReaderContext } from '../context/ReaderContext'
import './ReaderSettings.css'

export default function ReaderSettings({ onClose }) {
  const { settings, updateSetting } = useContext(ReaderContext)

  return (
    <div className="reader-settings-overlay" onClick={onClose}>
      <div className="reader-settings-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Cài đặt hiển thị</h3>
        
        <div className="setting-group">
          <label>Màu nền</label>
          <div className="setting-options">
            <button className={settings.theme === 'light' ? 'active' : ''} onClick={() => updateSetting('theme', 'light')}>Sáng</button>
            <button className={settings.theme === 'dark' ? 'active' : ''} onClick={() => updateSetting('theme', 'dark')}>Tối</button>
            <button className={settings.theme === 'sepia' ? 'active' : ''} onClick={() => updateSetting('theme', 'sepia')}>Sepia</button>
          </div>
        </div>

        <div className="setting-group">
          <label>Phông chữ</label>
          <div className="setting-options">
            <button className={settings.fontFamily === 'sans-serif' ? 'active' : ''} onClick={() => updateSetting('fontFamily', 'sans-serif')}>Sans-serif</button>
            <button className={settings.fontFamily === 'serif' ? 'active' : ''} onClick={() => updateSetting('fontFamily', 'serif')}>Serif</button>
          </div>
        </div>

        <div className="setting-group">
          <label>Cỡ chữ ({settings.fontSize}px)</label>
          <div className="setting-options">
            <button onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}>A-</button>
            <button onClick={() => updateSetting('fontSize', Math.min(32, settings.fontSize + 2))}>A+</button>
          </div>
        </div>

        <div className="setting-group">
          <label>Giãn dòng ({settings.lineHeight})</label>
          <div className="setting-options">
            <button onClick={() => updateSetting('lineHeight', Math.max(1.2, settings.lineHeight - 0.2))}>Thấp</button>
            <button onClick={() => updateSetting('lineHeight', Math.min(2.4, settings.lineHeight + 0.2))}>Cao</button>
          </div>
        </div>
        
        <button className="close-btn" onClick={onClose}>Đóng</button>
      </div>
    </div>
  )
}
