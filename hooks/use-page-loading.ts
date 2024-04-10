"use client"
import { Router } from "next/router";
import { useEffect, useState } from "react";
import NProgress from 'nprogress';

export const usePageLoading = () => {
    const [isPageLoading, setIsPageLoading] = useState(false)

    useEffect(() => {
        Router.events.on('routeChangeStart', (url) => {
            console.log(`Loading: ${url}`);
            setIsPageLoading(true)
            NProgress.start();
        });
        
        Router.events.on('routeChangeComplete', () => {
            setIsPageLoading(false)
            NProgress.done()
        });
        Router.events.on('routeChangeError', () => {
            setIsPageLoading(false)
            NProgress.done()
        });

        return () => {
            Router.events.off('routeChangeStart', (url) => {
                console.log(`Loading: ${url}`);
                setIsPageLoading(true)
                NProgress.start();
            });
            
            Router.events.off('routeChangeComplete', () => {
                setIsPageLoading(false)
                NProgress.done()
            });
            Router.events.off('routeChangeError', () => {
                setIsPageLoading(false)
                NProgress.done()
            });
        }
    }, [])
    return { isPageLoading } // We can use this state provided by this hook to render out our skeleton when the page loads up.
}


