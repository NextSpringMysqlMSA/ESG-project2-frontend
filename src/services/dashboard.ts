'use client'

import api from '@/lib/axios'

export const fetchTcfdProgress = async () => {
  const response = await api.get(`/api/v1/dashboard/tcfd/progress`)
  return response.data
}

export const fetchGriProgress = async () => {
  const response = await api.get(`/api/v1/dashboard/gri/progress`)
  return response.data
}

export const fetchNetZeroEmission = async () => {
  const response = await api.get(`/api/v1/dashboard/tcfd/progress/netzero`)
  return response.data
}

export const fetchReminder = async () => {
  const response = await api.get(`/api/v1/dashboard/reminder`)
  return response.data
}
