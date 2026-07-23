import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from './useAuth'

export function useWardrobe() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) fetchItems()
  }, [user])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setItems(data || [])
    setLoading(false)
  }

  async function addItem(item, photoFile) {
    let photo_url = null
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('user-photos').upload(filePath, photoFile)
      if (!uploadError) {
        const { data } = supabase.storage.from('user-photos').getPublicUrl(filePath)
        photo_url = data.publicUrl
      }
    }
    const { data, error } = await supabase.from('wardrobe_items').insert([{ ...item, user_id: user.id, photo_url }]).select()
    if (error) throw error
    setItems(prev => [data[0], ...prev])
    return data[0]
  }

  async function deleteItem(id) {
    const { error } = await supabase.from('wardrobe_items').delete().eq('id', id)
    if (error) throw error
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, error, addItem, deleteItem, refetch: fetchItems }
}
