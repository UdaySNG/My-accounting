import { ref } from 'vue'
import type { Integration, IntegrationConnection, IntegrationSettings } from '@/types/integrations'
import { AVAILABLE_INTEGRATIONS } from '@/types/integrations'

// Mock API calls - replace with actual API calls in production
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getIntegrationSettings = async (): Promise<IntegrationSettings> => {
  await mockDelay(500) // Simulate API delay
  return {
    connections: []
  }
}

export const connectIntegration = async (integrationId: string): Promise<IntegrationConnection> => {
  await mockDelay(1000) // Simulate API delay
  return {
    integrationId,
    status: 'connected',
    connectedAt: new Date(),
    lastSync: new Date()
  }
}

export const disconnectIntegration = async (integrationId: string): Promise<void> => {
  await mockDelay(500) // Simulate API delay
}

export const refreshIntegration = async (integrationId: string): Promise<IntegrationConnection> => {
  await mockDelay(1000) // Simulate API delay
  return {
    integrationId,
    status: 'connected',
    connectedAt: new Date(),
    lastSync: new Date()
  }
}

export const getIntegrationStatus = async (integrationId: string): Promise<IntegrationConnection> => {
  await mockDelay(500) // Simulate API delay
  return {
    integrationId,
    status: 'disconnected'
  }
}

// Composable for managing integrations
export const useIntegrations = () => {
  const integrations = ref<Integration[]>(AVAILABLE_INTEGRATIONS)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const refreshIntegrations = async () => {
    isLoading.value = true
    error.value = null
    try {
      const settings = await getIntegrationSettings()
      // Update integration statuses based on connections
      integrations.value = integrations.value.map(integration => {
        const connection = settings.connections.find(c => c.integrationId === integration.id)
        return {
          ...integration,
          status: connection?.status || 'disconnected',
          lastSync: connection?.lastSync
        }
      })
    } catch (err) {
      error.value = 'Er is een fout opgetreden bij het verversen van de integraties'
      console.error('Error refreshing integrations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const connectIntegration = async (integrationId: string) => {
    isLoading.value = true
    error.value = null
    try {
      const connection = await connectIntegration(integrationId)
      // Update integration status
      const index = integrations.value.findIndex(i => i.id === integrationId)
      if (index !== -1) {
        integrations.value[index] = {
          ...integrations.value[index],
          status: connection.status,
          lastSync: connection.lastSync
        }
      }
    } catch (err) {
      error.value = 'Er is een fout opgetreden bij het verbinden van de integratie'
      console.error('Error connecting integration:', err)
    } finally {
      isLoading.value = false
    }
  }

  const disconnectIntegration = async (integrationId: string) => {
    isLoading.value = true
    error.value = null
    try {
      await disconnectIntegration(integrationId)
      // Update integration status
      const index = integrations.value.findIndex(i => i.id === integrationId)
      if (index !== -1) {
        integrations.value[index] = {
          ...integrations.value[index],
          status: 'disconnected',
          lastSync: undefined
        }
      }
    } catch (err) {
      error.value = 'Er is een fout opgetreden bij het verbreken van de integratie'
      console.error('Error disconnecting integration:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    integrations,
    isLoading,
    error,
    refreshIntegrations,
    connectIntegration,
    disconnectIntegration
  }
} 