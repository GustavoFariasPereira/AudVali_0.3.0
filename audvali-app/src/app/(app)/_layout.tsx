import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Colors } from "../../assets/colors/paleta01";

export default function AppLayout(){
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                backgroundColor: Colors.brand.surface || "#1A1A1A",
                },
                headerTintColor: Colors.brand.lightest,
                headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 18,
                },
                headerShadowVisible: false,
                contentStyle: {
                backgroundColor: Colors.brand.darkest || "#121212",
                },
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen
                name="menuAuditorias"
                options={{
                title: "        Menu Auditorias",
                headerLeft: () => (
                    <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 5,
                    }}
                    >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={Colors.brand.lightest}
                    />
                    <Text
                        style={{
                        color: Colors.brand.lightest,
                        marginLeft: 5,
                        fontSize: 16,
                        }}
                    >
                        Voltar
                    </Text>
                    </TouchableOpacity>
                ),
                }}
            />
            <Stack.Screen
                name="criarAuditoria"
                options={{
                title: "        Criar Auditoria",
                headerLeft: () => (
                    <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 5,
                    }}
                    >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={Colors.brand.lightest}
                    />
                    <Text
                        style={{
                        color: Colors.brand.lightest,
                        marginLeft: 5,
                        fontSize: 16,
                        }}
                    >
                        Voltar
                    </Text>
                    </TouchableOpacity>
                ),
                }}
            />
            <Stack.Screen
                name="atualizarAuditoria"
                options={{
                title: "        Atualizar Auditoria",
                headerLeft: () => (
                    <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 5,
                    }}
                    >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={Colors.brand.lightest}
                    />
                    <Text
                        style={{
                        color: Colors.brand.lightest,
                        marginLeft: 5,
                        fontSize: 16,
                        }}
                    >
                        Voltar
                    </Text>
                    </TouchableOpacity>
                ),
                }}
            />
            <Stack.Screen
                name="visualizarAuditoria"
                options={{
                title: "        Visualizar Auditoria",
                headerLeft: () => (
                    <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 5,
                    }}
                    >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={Colors.brand.lightest}
                    />
                    <Text
                        style={{
                        color: Colors.brand.lightest,
                        marginLeft: 5,
                        fontSize: 16,
                        }}
                    >
                        Voltar
                    </Text>
                    </TouchableOpacity>
                ),
                }}
            />
        </Stack>
    )
}