import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { type PagedData } from '../components/DataTable'

// Type definitions
export interface AnswerResponse {
  id: number
  answer: string
  is_correct: boolean
}

export interface QuestionResponse {
  id: number
  question: string
  answers: AnswerResponse[]
}

export interface QuestionPageResponse {
  page: number
  page_size: number
  total_items: number
  total_pages: number
  data: QuestionResponse[]
}

// API configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    'x-api-key': import.meta.env.VITE_AWS_API_KEY,
    'x-origin': 'pe.newxperience.caminosdelinca',
  },
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

  const response = await axios.get<{ data: QuestionPageResponse }>(
    `${API_CONFIG.baseURL}/caminosdelinca/questions_with_answers`,
    {
      params,
      headers: API_CONFIG.headers,
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

// Hook for creating a new question (mutation)
export const useCreateQuestion = () => {
  // TODO: Implement when create endpoint is available
  // return useMutation({
  //   mutationFn: (newQuestion: CreateQuestionRequest) => createQuestion(newQuestion),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['questions'] })
  //   },
  // })
}

// Hook for updating a question (mutation)
export const useUpdateQuestion = () => {
  // TODO: Implement when update endpoint is available
  // return useMutation({
  //   mutationFn: ({ id, data }: { id: number; data: UpdateQuestionRequest }) =>
  //     updateQuestion(id, data),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['questions'] })
  //   },
  // })
}

// Hook for deleting a question (mutation)
export const useDeleteQuestion = () => {
  // TODO: Implement when delete endpoint is available
  // return useMutation({
  //   mutationFn: (id: number) => deleteQuestion(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['questions'] })
  //   },
  // })
}

export default useQuestions
