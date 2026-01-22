// CategoryDropdown.tsx (modern pill-based category selector)

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

  return (
    <div className="flex gap-3 flex-wrap">
      {/* ALL PRODUCTS */}
      <button
        onClick={() => handleSelect(null)}
        className={`px-5 py-2 rounded-full text-sm font-medium transition
          ${
            activeId === null
              ? 'bg-green-600 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        All
      </button>

      {/* CATEGORY PILLS */}
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => handleSelect(category.id)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition
            ${
              activeId === category.id
                ? 'bg-green-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryDropdown
