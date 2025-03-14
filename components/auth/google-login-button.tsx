'use client'

import { useSignIn } from '@clerk/nextjs'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react' // Icône de chargement
import { FcGoogle, } from 'react-icons/fc'

export default function GoogleLoginButton() {
    const { signIn } = useSignIn()
    const [loading, setLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        if (!signIn) return
        setLoading(true) // Active l'état de chargement

        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/home',
            })
        } catch (error) {
            console.error('Google Sign-In Error:', error)
            setLoading(false) // Désactive le chargement en cas d'erreur
        }
    }

    return (
        <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-100"
        >
            {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <FcGoogle className="h-5 w-5" />
            )}
            Use Google account
        </Button>
    )
}

