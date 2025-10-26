import React from 'react';

interface SwapSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  slippage: string;
  setSlippage: (value: string) => void;
}

export const SwapSettings: React.FC<SwapSettingsProps> = ({
  isOpen,
  onClose,
  slippage,
  setSlippage,
}) => {
  if (!isOpen) return null;

  const handleSlippageClick = (value: string) => {
    setSlippage(value);
  };

  const handleCustomSlippage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 50) {
      setSlippage(value);
    }
  };

  return (
    <div className="settings-modal" onClick={onClose}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">Transaction Settings</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-label">Slippage Tolerance</div>
          
          <div className="slippage-buttons">
            <button
              className={`slippage-button ${slippage === '0.1' ? 'active' : ''}`}
              onClick={() => handleSlippageClick('0.1')}
            >
              0.1%
            </button>
            <button
              className={`slippage-button ${slippage === '0.5' ? 'active' : ''}`}
              onClick={() => handleSlippageClick('0.5')}
            >
              0.5%
            </button>
            <button
              className={`slippage-button ${slippage === '1.0' ? 'active' : ''}`}
              onClick={() => handleSlippageClick('1.0')}
            >
              1.0%
            </button>
          </div>

          <div className="slippage-input-container">
            <input
              type="text"
              className="slippage-input"
              value={slippage}
              onChange={handleCustomSlippage}
              placeholder="0.5"
            />
            <span style={{ color: '#fff' }}>%</span>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">Transaction Deadline</div>
          <div className="deadline-display">
            <span className="deadline-label">Current setting</span>
            <span className="deadline-value">20 minutes</span>
          </div>
        </div>

        <div className="info-message">
          <span className="info-icon">ⓘ</span>
          <span className="info-text">
            Slippage tolerance is the maximum price change you're willing to accept.
          </span>
        </div>

        <div className="info-message">
          <span className="info-icon">ⓘ</span>
          <span className="info-text">
            Transactions will revert if pending for longer than the deadline.
          </span>
        </div>
      </div>
    </div>
  );
};