import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { type PagedData } from '../components/DataTable'
import { apiClient } from '../services/apiClient'

// Type definitions
export interface AnswerResponse {
  id: number
  answer: string
  is_correct: boolean
}

export interface QuestionResponse {
  id: number
  question: string
  feedback?: string
  status?: 'AVAILABLE' | 'DELETED'
  answers: AnswerResponse[]
}

export interface QuestionPageResponse {
  page: number
  page_size: number
  total_items: number
  total_pages: number
  data: QuestionResponse[]
}

export interface QuestionRequest {
  question: string
  feedback?: string
  status?: 'AVAILABLE' | 'DELETED'
  answers: { value: string; isCorrect: boolean }[]
}

// API function to fetch questions
const fetchQuestions = async (
  page: number,
  pageSize: number = 50,
  search: string = ''
): Promise<PagedData<QuestionResponse>> => {
  const params: { page: number; page_size: number; search?: string } = {
    page,
    page_size: pageSize,
  }

  if (search.trim()) {
    params.search = search.trim()
  }

  const response = await apiClient.instance.get<{ data: QuestionPageResponse }>(
    `/caminosdelinca/questions_with_answers`,
    {
      params,
    }
  )

  // Transform API response to PagedData format
  const apiData = response.data.data
  return {
    items: apiData.data,
    page: apiData.page,
    pageSize: apiData.page_size,
    totalItems: apiData.total_items,
    totalPages: apiData.total_pages,
  }
}

const createQuestion = async (data: QuestionRequest) => {
  await apiClient.instance.post<void>(`/caminosdelinca/questions`, data)
}

const updateQuestion = async (id: number, data: QuestionRequest) => {
  await apiClient.instance.put<void>(`/caminosdelinca/questions/${id}`, data)
}

const deleteQuestion = async (id: number) => {
  await apiClient.instance.delete<void>(`/caminosdelinca/questions/${id}`)
}

// Custom hook using React Query
export const useQuestions = (page: number, pageSize: number = 50, search: string = '') => {
  return useQuery({
    queryKey: ['questions', page, pageSize, search],
    queryFn: () => fetchQuestions(page, pageSize, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    enabled: page > 0, // Only run query if page is valid
  })
}

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newQuestion: QuestionRequest) => createQuestion(newQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Pregunta creada correctamente')
    },
    onError: (error) => {
      toast.error('Error al crear la pregunta')
      throw error
    },
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: QuestionRequest }) => updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Pregunta actualizada correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar la pregunta')
      throw error
    },
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    },
    onError: (error) => {
      toast.error('Error al eliminar la pregunta')
      throw error
    },
  })
}

export default useQuestions
