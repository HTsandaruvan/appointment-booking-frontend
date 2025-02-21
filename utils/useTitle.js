"use client";
import { useEffect } from "react";
import Head from "next/head";

export default function useTitle(title) {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <Head>
            <title>{title}</title>
        </Head>
    );
}
