'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface EquipmentData {
  category: 'hooks' | 'lures' | 'lines' | 'weights' | 'floats' | 'other'
  quantity: 'few' | 'many' | 'lots' | 'huge_haul' | '1-5m' | '5-10m' | '10-20m' | '20m+'
  description?: string
}

interface Props {
  onEquipmentChange: (equipment: EquipmentData[]) => void
}

export default function EquipmentTracker({ onEquipmentChange }: Props) {
  const [equipmentList, setEquipmentList] = useState<EquipmentData[]>([])
  const [currentEquipment, setCurrentEquipment] = useState<Partial<EquipmentData>>({})
  const [showAddForm, setShowAddForm] = useState(false)

  const categories = [
    { value: 'hooks', label: 'Krokar', emoji: '🪝', description: 'Fiskkrokar av olika storlekar' },
    { value: 'lures', label: 'Beten/Drag', emoji: '🎣', description: 'Spinnare, jigg, wobblers' },
    { value: 'lines', label: 'Fiskelina', emoji: '🧵', description: 'Nylonlina, flätlina' },
    { value: 'weights', label: 'Vikter/Lod', emoji: '⚖️', description: 'Bly, tungsten' },
    { value: 'floats', label: 'Flöten', emoji: '🎈', description: 'Flöten, dobber, kork' },
    { value: 'other', label: 'Övrigt', emoji: '🔧', description: 'Annan fiskeutrustning (nät, etc.)' }
  ] as const

  const quantities = [
    { value: 'few', label: 'Några få (1-10)', description: 'Mindre mängd' },
    { value: 'many', label: 'Flera (10-50)', description: 'Medelstör mängd' },
    { value: 'lots', label: 'Många (50+)', description: 'Stor mängd' },
    { value: 'huge_haul', label: 'Extremt mycket (100+)', description: 'Mycket stor mängd' }
  ] as const

  const lineQuantities = [
    { value: '1-5m', label: '1-5 meter', description: 'Kort längd' },
    { value: '5-10m', label: '5-10 meter', description: 'Medellängd' },
    { value: '10-20m', label: '10-20 meter', description: 'Lång längd' },
    { value: '20m+', label: '20+ meter', description: 'Mycket lång längd' }
  ] as const

  const addEquipment = () => {
    if (currentEquipment.category && currentEquipment.quantity) {
      const newEquipment = currentEquipment as EquipmentData
      const updatedList = [...equipmentList, newEquipment]
      setEquipmentList(updatedList)
      onEquipmentChange(updatedList)
      setCurrentEquipment({})
      setShowAddForm(false)
    }
  }

  const removeEquipment = (index: number) => {
    const updatedList = equipmentList.filter((_, i) => i !== index)
    setEquipmentList(updatedList)
    onEquipmentChange(updatedList)
  }

  const clearAll = () => {
    setEquipmentList([])
    setCurrentEquipment({})
    setShowAddForm(false)
    onEquipmentChange([])
  }

  const getQuantityOptions = () => {
    if (currentEquipment.category === 'lines') {
      return lineQuantities
    }
    return quantities
  }

  const getQuantityLabel = (category: string, quantity: string) => {
    if (category === 'lines') {
      return lineQuantities.find(q => q.value === quantity)?.label || quantity
    }
    return quantities.find(q => q.value === quantity)?.label || quantity
  }

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-medium text-gray-900">
          Typ av utrustning (valfritt)
        </h3>
        {equipmentList.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Rensa alla
          </button>
        )}
      </div>
      
      <p className="text-xs md:text-sm text-gray-600">
        Hjälp oss få bättre statistik över vad som återvinns från våra vatten
      </p>

      {/* Current Equipment List */}
      {equipmentList.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 text-sm">Tillagd utrustning:</h4>
          {equipmentList.map((equipment, index) => (
            <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2 md:p-3">
              <div className="flex items-center space-x-2">
                <span className="text-base md:text-lg">
                  {getCategoryInfo(equipment.category)?.emoji}
                </span>
                <div className="text-xs md:text-sm">
                  <span className="font-medium text-green-800">
                    {getCategoryInfo(equipment.category)?.label}
                  </span>
                  <span className="text-green-600 ml-1 md:ml-2 block md:inline">
                    {getQuantityLabel(equipment.category, equipment.quantity)}
                  </span>
                  {equipment.description && (
                    <div className="text-green-700 text-xs mt-1">{equipment.description}</div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeEquipment(index)}
                className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Equipment Button */}
      {!showAddForm && (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 text-accent hover:text-orange-600 font-medium text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span>Lägg till utrustning</span>
        </button>
      )}

      {/* Add Equipment Form - Mobile Optimized */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-3 md:p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3 text-sm md:text-base">Lägg till utrustning</h4>
          
          {/* Category Selection - Mobile Grid */}
          <div className="mb-2 md:mb-4">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Typ av utrustning *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setCurrentEquipment({...currentEquipment, category: category.value})}
                  className={`p-2 md:p-3 rounded-lg border text-left transition-colors ${
                    currentEquipment.category === category.value
                      ? 'border-accent bg-orange-50 text-accent'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="text-sm md:text-lg">{category.emoji}</span>
                    <div className="text-xs md:text-sm font-medium">{category.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection - Mobile Optimized */}
          {currentEquipment.category && (
            <div className="mb-2 md:mb-4">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                {currentEquipment.category === 'lines' && 'Längd *'}
                {currentEquipment.category !== 'lines' && 'Ungefärlig mängd *'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {getQuantityOptions().map((quantity) => (
                  <button
                    key={quantity.value}
                    type="button"
                    onClick={() => setCurrentEquipment({...currentEquipment, quantity: quantity.value})}
                    className={`p-2 md:p-3 rounded-lg border text-left transition-colors ${
                      currentEquipment.quantity === quantity.value
                        ? 'border-accent bg-orange-50 text-accent'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs md:text-sm font-medium">{quantity.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description - Compact */}
          {currentEquipment.category && (
            <div className="mb-2 md:mb-4">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Ytterligare detaljer (valfritt)
              </label>
              <textarea
                value={currentEquipment.description || ''}
                onChange={(e) => setCurrentEquipment({...currentEquipment, description: e.target.value})}
                className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm"
                rows={2}
                placeholder={
                  currentEquipment.category === 'lines' 
                    ? 'T.ex. typ av lina (nylon, flätlina), tjocklek...'
                    : currentEquipment.category === 'floats'
                    ? 'T.ex. typ av flöte (kork, plast), storlek, färg...'
                    : 'T.ex. storlek på krokar, typ av beten...'
                }
              />
            </div>
          )}

          {/* Form Actions - Always Visible */}
          <div className="flex space-x-2 bg-white p-2 rounded border-t sticky bottom-0 md:static md:bg-transparent md:border-0 md:p-0">
            <button
              type="button"
              onClick={addEquipment}
              disabled={!currentEquipment.category || !currentEquipment.quantity}
              className="flex-1 bg-accent text-white px-3 md:px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lägg till
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentEquipment({})
                setShowAddForm(false)
              }}
              className="bg-gray-500 text-white px-3 md:px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 