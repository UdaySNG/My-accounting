import { apiClient } from './api'

export interface DocumentUploadResponse {
  id: number
  filename: string
  original_filename: string
  url: string
  uploadedAt: string
  isArchived: boolean
  archivedAt: string | null
  mime_type: string
  size: number
}

export const documentService = {
  async uploadDocument(file: File): Promise<{ document: DocumentUploadResponse, message: string }> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiClient.post<DocumentUploadResponse>('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return {
        document: response.data,
        message: `Document "${response.data.original_filename}" succesvol geüpload`
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      throw new Error('Er is een fout opgetreden bij het uploaden van het document')
    }
  },

  async getDocuments(includeArchived: boolean = false): Promise<DocumentUploadResponse[]> {
    try {
      const response = await apiClient.get<DocumentUploadResponse[]>('/documents', {
        params: { includeArchived }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching documents:', error)
      throw new Error('Er is een fout opgetreden bij het ophalen van de documenten')
    }
  },

  async getArchivedDocuments(): Promise<DocumentUploadResponse[]> {
    try {
      const response = await apiClient.get<DocumentUploadResponse[]>('/documents/archived')
      return response.data
    } catch (error) {
      console.error('Error fetching archived documents:', error)
      throw new Error('Er is een fout opgetreden bij het ophalen van de gearchiveerde documenten')
    }
  },

  async archiveDocument(documentId: string): Promise<DocumentUploadResponse> {
    try {
      const response = await apiClient.post<DocumentUploadResponse>(`/documents/${documentId}/archive`)
      return response.data
    } catch (error) {
      console.error('Error archiving document:', error)
      throw new Error('Er is een fout opgetreden bij het archiveren van het document')
    }
  },

  async unarchiveDocument(documentId: string): Promise<DocumentUploadResponse> {
    try {
      const response = await apiClient.post<DocumentUploadResponse>(`/documents/${documentId}/unarchive`)
      return response.data
    } catch (error) {
      console.error('Error unarchiving document:', error)
      throw new Error('Er is een fout opgetreden bij het uit het archief halen van het document')
    }
  },

  async deleteDocument(documentId: string): Promise<void> {
    try {
      await apiClient.delete(`/documents/${documentId}`)
    } catch (error) {
      console.error('Error deleting document:', error)
      throw new Error('Er is een fout opgetreden bij het verwijderen van het document')
    }
  }
} 