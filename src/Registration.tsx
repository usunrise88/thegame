import React, { useState } from 'react';
import { UserData } from './types';
import './Registration.css';

interface Props {
  onRegister: (user: UserData) => void;
  onShowLeaderboard: () => void;
}

export const Registration: React.FC<Props> = ({ onRegister, onShowLeaderboard }) => {
  const [form, setForm] = useState<UserData>({
    name: '',
    nickname: '',
    email: '',
    telegram: '',
    position: '',
    company: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Введите имя';
    if (!form.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Некорректный email';
    }
    if (!form.telegram.trim()) {
      newErrors.telegram = 'Введите Telegram';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRegister(form);
    }
  };

  const handleChange = (field: keyof UserData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-card">
        <div className="reg-header">
          <div className="reg-logo">
            <span className="reg-logo-dot" />
            <span className="reg-logo-text">DEV GAME</span>
          </div>
          <h1 className="reg-title">
            <span className="reg-title-strike">Просто игра?</span>
            <br />
            Серьёзный вызов.
          </h1>
          <p className="reg-subtitle">
            Управляй командой разработки. Побеждай. Попади в лидерборд.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-field">
            <label className="reg-label">Имя *</label>
            <input
              type="text"
              className={`reg-input ${errors.name ? 'reg-input-error' : ''}`}
              placeholder="Как тебя зовут?"
              value={form.name}
              onChange={handleChange('name')}
            />
            {errors.name && <span className="reg-error">{errors.name}</span>}
          </div>

          <div className="reg-field">
            <label className="reg-label">Никнейм <span className="reg-optional">(опционально)</span></label>
            <input
              type="text"
              className="reg-input"
              placeholder="Для лидерборда"
              value={form.nickname}
              onChange={handleChange('nickname')}
            />
          </div>

          <div className="reg-field">
            <label className="reg-label">Email *</label>
            <input
              type="email"
              className={`reg-input ${errors.email ? 'reg-input-error' : ''}`}
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange('email')}
            />
            {errors.email && <span className="reg-error">{errors.email}</span>}
          </div>

          <div className="reg-field">
            <label className="reg-label">Telegram *</label>
            <input
              type="text"
              className={`reg-input ${errors.telegram ? 'reg-input-error' : ''}`}
              placeholder="@username"
              value={form.telegram}
              onChange={handleChange('telegram')}
            />
            {errors.telegram && <span className="reg-error">{errors.telegram}</span>}
          </div>

          <div className="reg-row">
            <div className="reg-field">
              <label className="reg-label">Должность <span className="reg-optional">(опционально)</span></label>
              <input
                type="text"
                className="reg-input"
                placeholder="Frontend Dev"
                value={form.position}
                onChange={handleChange('position')}
              />
            </div>

            <div className="reg-field">
              <label className="reg-label">Компания <span className="reg-optional">(опционально)</span></label>
              <input
                type="text"
                className="reg-input"
                placeholder="Точка"
                value={form.company}
                onChange={handleChange('company')}
              />
            </div>
          </div>

          <button type="submit" className="reg-button">
            <span>Начать игру</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button type="button" className="reg-leaderboard-link" onClick={onShowLeaderboard}>
            Посмотреть лидерборд
          </button>
        </form>
      </div>
    </div>
  );
};
