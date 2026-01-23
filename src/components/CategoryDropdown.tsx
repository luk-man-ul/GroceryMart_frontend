import { useEffect, useState } from 'react'
import api from '../api/axios'
import type { Category } from '../types'

interface Props {
  onSelect: (categoryId: number | null) => void
}

const CategoryDropdown = ({ onSelect }: Props) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const handleSelect = (id: number | null) => {
    setActiveId(id)
    onSelect(id)
  }

  if (categories.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {/* Shop by Category */}
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* ALL PRODUCTS */}
        <button
          onClick={() => handleSelect(null)}
          className={`group flex flex-col items-center min-w-[72px] transition
            ${
              activeId === null
                ? 'text-black'
                : 'text-gray-500 hover:text-black'
            }`}
        >
          <div
            className={`w-15 h-15 rounded-full flex items-center justify-center
              border transition  transition-all duration-300 ease-out group-hover:scale-110
              ${
                activeId === null
                  ? 'border-black'
                  : 'border-gray-200'
              }`}
          >
            <span className="text-xl font-bold">🛒</span>
          </div>
          <span className="text-xs mt-1 whitespace-nowrap">
            All
          </span>
        </button>

        {categories.map(category => {
          const isActive = activeId === category.id

          return (
            <button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`group flex flex-col items-center min-w-[72px] transition
                ${
                  isActive
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
            >
              <div
                className={`w-15 h-15 rounded-full bg-white flex items-center justify-center
                  border transition overflow-hidden transition-all duration-300 ease-out group-hover:scale-110
                  ${
                    isActive
                      ? 'border-black'
                      : 'border-gray-200'
                  }`}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {category.name.charAt(0)}
                  </span>
                )}
              </div>

              <span className="text-xs mt-1 text-center whitespace-nowrap">
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryDropdown
