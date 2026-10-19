import { Stack } from "expo-router";

export default function AuthLayout(){
    return (
        <Stack
            screenOptions={{
                animation: "fade",
            }}
        >
            <Stack.Screen
                name="loginColaborador"
                options={{
                    title: "Login",
                }}
            />
            <Stack.Screen
                name="cadastroColaborador"
                options={{
                title: "Cadastro",
                }}
            />
            <Stack.Screen
                name="confirmarEmail"
                options={{
                    title: "Verificação de E-mail",
                }}
            />
        </Stack>
    );
}