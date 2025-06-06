import { renderHook, act } from '@testing-library/react'
import { useCategoriesData } from '../useCategoriesData'

vi.mock('../../utils/supabaseUtils', () => ({
  fetchCategories: vi.fn().mockResolvedValue([{ id: '1', name: 'Food', icon: '🍔', type: 'expense' }]),
  addCategoryToDb: vi.fn(),
  updateCategoryInDb: vi.fn(),
  deleteCategoryFromDb: vi.fn(),
  isCategoryUsed: vi.fn().mockResolvedValue(false)
}))

vi.mock('../useAuthStatus', () => ({
  useAuthStatus: () => ({ isAuthenticated: true })
}))

vi.mock('../use-toast', () => ({
  useToast: () => ({ toast: () => {} })
}))

describe('useCategoriesData', () => {
  it('loads categories on mount', async () => {
    const { result } = renderHook(() => useCategoriesData())
    await act(() => Promise.resolve())
    expect(result.current.categories).toHaveLength(1)
  })
})
