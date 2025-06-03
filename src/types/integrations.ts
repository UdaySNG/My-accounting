export type IntegrationCategory = 'banking' | 'accounting' | 'payment' | 'ecommerce' | 'crm'

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error'

export interface Integration {
  id: string
  name: string
  category: IntegrationCategory
  description: string
  icon: string
  status: IntegrationStatus
  lastSync?: Date
  settings?: Record<string, any>
}

export interface IntegrationConnection {
  integrationId: string
  status: IntegrationStatus
  connectedAt?: Date
  lastSync?: Date
  settings?: Record<string, any>
}

export interface IntegrationSettings {
  connections: IntegrationConnection[]
}

export const INTEGRATION_CATEGORIES: Record<IntegrationCategory, string> = {
  banking: 'Banking',
  accounting: 'Boekhoudsoftware',
  payment: 'Betaalproviders',
  ecommerce: 'Webwinkels',
  crm: 'CRM'
}

export const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'rabobank',
    name: 'Rabobank',
    category: 'banking',
    description: 'Directe bankkoppeling voor automatische boekingen',
    icon: 'account_balance',
    status: 'connected',
    lastSync: new Date()
  },
  {
    id: 'ing',
    name: 'ING',
    category: 'banking',
    description: 'Directe bankkoppeling voor automatische boekingen',
    icon: 'account_balance',
    status: 'disconnected'
  },
  {
    id: 'exact-online',
    name: 'Exact Online',
    category: 'accounting',
    description: 'Synchroniseer met je boekhouding',
    icon: 'account_balance',
    status: 'connected',
    lastSync: new Date()
  },
  {
    id: 'moneybird',
    name: 'Moneybird',
    category: 'accounting',
    description: 'Synchroniseer met je boekhouding',
    icon: 'account_balance',
    status: 'disconnected'
  },
  {
    id: 'mollie',
    name: 'Mollie',
    category: 'payment',
    description: 'Online betalingen verwerken',
    icon: 'payments',
    status: 'disconnected'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    description: 'Online betalingen verwerken',
    icon: 'payments',
    status: 'disconnected'
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    category: 'ecommerce',
    description: 'Synchroniseer je webshop orders',
    icon: 'shopping_cart',
    status: 'disconnected'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'ecommerce',
    description: 'Synchroniseer je webshop orders',
    icon: 'shopping_cart',
    status: 'disconnected'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    description: 'Synchroniseer klantgegevens',
    icon: 'people',
    status: 'disconnected'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    description: 'Synchroniseer klantgegevens',
    icon: 'people',
    status: 'disconnected'
  }
] 