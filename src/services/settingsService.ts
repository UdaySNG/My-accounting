import { apiClient } from './api'

// Types
export interface ProfileSettings {
  name: string
  email: string
  phone?: string
  company?: string
}

export interface FiscalSettings {
  fiscalYear: 'calendar' | 'fiscal' | 'custom'
  fiscalYearStart?: string
  vatNumber: string
  kvkNumber: string
  vatFrequency: 'monthly' | 'quarterly' | 'yearly'
}

export interface InvoiceSettings {
  numbering: 'yearly' | 'continuous' | 'custom'
  customFormat?: string
  paymentTerm: number
  template: 'default' | 'modern' | 'minimal'
  autoReminders: boolean
}

export interface BackupSettings {
  autoBackup: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  notifications: boolean
  retention: string
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  reminders: boolean
}

export interface AppearanceSettings {
  theme: 'system' | 'light' | 'dark'
  language: 'nl' | 'en'
  timezone: string
}

export interface SecuritySettings {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactor: boolean
}

// Profile Settings
export const getProfileSettings = async (): Promise<ProfileSettings> => {
  const response = await apiClient.get('/settings/profile')
  return response.data
}

export const updateProfileSettings = async (settings: ProfileSettings): Promise<ProfileSettings> => {
  const response = await apiClient.put('/settings/profile', settings)
  return response.data
}

// Fiscal Settings
export const getFiscalSettings = async (): Promise<FiscalSettings> => {
  const response = await apiClient.get('/settings/fiscal')
  return response.data
}

export const updateFiscalSettings = async (settings: FiscalSettings): Promise<FiscalSettings> => {
  const response = await apiClient.put('/settings/fiscal', settings)
  return response.data
}

// Invoice Settings
export const getInvoiceSettings = async (): Promise<InvoiceSettings> => {
  const response = await apiClient.get('/settings/invoice')
  return response.data
}

export const updateInvoiceSettings = async (settings: InvoiceSettings): Promise<InvoiceSettings> => {
  const response = await apiClient.put('/settings/invoice', settings)
  return response.data
}

// Backup Settings
export const getBackupSettings = async (): Promise<BackupSettings> => {
  const response = await apiClient.get('/settings/backup')
  return response.data
}

export const updateBackupSettings = async (settings: BackupSettings): Promise<BackupSettings> => {
  const response = await apiClient.put('/settings/backup', settings)
  return response.data
}

// Notification Settings
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await apiClient.get('/settings/notifications')
  return response.data
}

export const updateNotificationSettings = async (settings: NotificationSettings): Promise<NotificationSettings> => {
  const response = await apiClient.put('/settings/notifications', settings)
  return response.data
}

// Appearance Settings
export const getAppearanceSettings = async (): Promise<AppearanceSettings> => {
  const response = await apiClient.get('/settings/appearance')
  return response.data
}

export const updateAppearanceSettings = async (settings: AppearanceSettings): Promise<AppearanceSettings> => {
  const response = await apiClient.put('/settings/appearance', settings)
  return response.data
}

// Security Settings
export const updatePassword = async (settings: SecuritySettings): Promise<void> => {
  await apiClient.put('/settings/security/password', {
    currentPassword: settings.currentPassword,
    newPassword: settings.newPassword,
    confirmPassword: settings.confirmPassword
  })
}

export const updateTwoFactor = async (enabled: boolean): Promise<void> => {
  await apiClient.put('/settings/security/2fa', { enabled })
} 