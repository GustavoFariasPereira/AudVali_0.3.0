import { Stack, router, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RootLayout() {
    const {
        isAuthenticated,
        isHydrated,
        carregarSessao,
    } = useAuthStore();

    const segments = useSegments();

    useEffect(() => {
        carregarSessao();
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        const dentroDoAuth = segments[0] === "(auth)";

        if (!isAuthenticated && !dentroDoAuth) {
            router.replace("/(auth)/loginColaborador");
            return;
        }

        if (isAuthenticated && dentroDoAuth) {
            router.replace("/");
        }
    }, [isAuthenticated, isHydrated, segments]);

    if (!isHydrated) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="(auth)"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}