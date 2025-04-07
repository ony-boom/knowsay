'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '../supabase'
import { getCurrentUserId } from './get-user'

export async function sendMessage(formData: FormData) {
  const content = formData.get('content') as string
  const receiver_id = formData.get('receiver_id') as string
  const senderId = await getCurrentUserId()


  const { error } = await supabase.from('messages').insert({
    content,
    sender_id: senderId,
    receiver_id,
    is_read: false,
  })

  if (error) {
    console.error('Erreur envoi message:', error.message)
    return
  }

  revalidatePath(`/messages/${receiver_id}/conversation`)
}
