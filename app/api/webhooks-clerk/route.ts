// import { NextRequest, NextResponse } from 'next/server';
// import { User } from '@/lib/definitions';
// import { supabase } from '@/lib/supabase';
// import bcrypt from "bcrypt";

// const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// export async function POST(req: NextRequest) {
  
//   const headers = req.headers;
//   const body = await req.json();
  
//   // Vérification du secret Clerk (sécurité)
//   if (headers.get('clerk-webhook-secret') !== CLERK_WEBHOOK_SECRET) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { type, data } = body;
//   const hash = await bcrypt.hash('1A2B4C***67TYZ', 10)

//   if (type === 'user.created' || type === 'user.updated') {
//     console.log('DATA IS', data)
//     const user: User & {
//       clerk_id: string;
//     }= {
//       clerk_id: data.id as string,
//       email: data.email_addresses[0]?.email_address || '',
//       name: `${data.first_name ?? ''} ${data.last_name ?? ''}`,
//       role: 'USER',
//       password_hash: hash
//     };

//     // Vérifier si l'utilisateur existe déjà dans Supabase
//     const { data: existingUser, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('clerk_id', user.clerk_id)
//       .single();
//     console.log('error on get user from supabase caused by:', error)
//     if (!existingUser) {
//       // Si l'utilisateur n'existe pas, l'insérer
//       try {
//         await supabase.from('users').insert([user]);
//       } catch (error) {
//         console.error('user added error cause by:', error)
//       }
//     } else {
//       // Sinon, mettre à jour les données
//       try {
//         await supabase.from('users').update(user).eq('clerk_id', user.clerk_id);
//       } catch(error) {
//         console.log('error on update user caused by:', error);
//       }
//     }
//   }

//   if (type === 'user.deleted') {
//     // Supprimer l'utilisateur de Supabase s'il est supprimé de Clerk
//     try {
//       await supabase.from('users').delete().eq('clerk_user_id', data.id);
//     } catch (error) {
//       console.error('erro on deleting user:', error)
//     }
//   }

//   return NextResponse.json({ success: true });
// }

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import { User } from '@/lib/definitions';
import { supabase } from '@/lib/supabase';

const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;
export async function POST(req: Request) {

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({error: 'Missing Svix headers'}, {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let event: WebhookEvent

  // Verify payload with headers
  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }
  const { id } = event.data
  const eventType = event.type
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  console.log('Webhook payload:', body)
  await manageUserEventData(event.data as UserJSON, eventType)


  return new Response('Webhook received', { status: 200 })
}


const manageUserEventData = async (data: UserJSON, type: WebhookEvent["type"]) => {
  /**
   * Note that password_has was omitted for now, it will be used later for two factor authentication
   */

  if (type === 'user.created' || type === 'user.updated') {
        const user: User & {
          clerk_id: string;
        }= {
          clerk_id: data.id as string,
          email: data?.email_addresses[0]?.email_address || '',
          name: `${data.first_name ?? ''} ${data.last_name ?? ''}`,
          role: 'USER',
          // password_hash: 
        };
    
        // Vérifier si l'utilisateur existe déjà dans Supabase
        const { data: existingUser, error } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.clerk_id)
          .single();
        console.log('error on get user from supabase caused by:', error)

        if (!existingUser) {
          // User creation on database
          try {
            await supabase.from('users').insert([user]);
          } catch (error) {
            console.error('user added error cause by:', error)
          }
        } else {
          // Update user datas
          try {
            await supabase.from('users').update(user).eq('clerk_id', user.clerk_id);
          } catch(error) {
            console.log('error on update user caused by:', error);
          }
        }
      }
    
      if (type === 'user.deleted') {
        // Delete user from database
        try {
          await supabase.from('users').delete().eq('id', data.id);
        } catch (error) {
          console.error('error on deleting user:', error)
        }
      }
}