import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAlterarSenhaADM } from "@/modules/administradores/administrador.hook";

export default function AlterarSenhaScreen(){
    const router = useRouter();
    const {handleAlterarSenhaADM, loading, error, success} = useAlterarSenhaADM();
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const onAlterarSenhaPress = async () => {
        await handleAlterarSenhaADM(senhaAtual, novaSenha, confirmarSenha);
    };
    if (success){
       Alert.alert(
        "Senha Alterada", 
        "Sua senha foi alterada com sucesso.", 
        [
            { 
            text: "Avançar", 
            onPress: () => router.replace("/loginColaborador")
            },
        ]
        );
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.logo}>Alterar Senha Administrador</Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <Text style={styles.label}>Senha Atual</Text>
                <TextInput
                    style={[styles.input, error && !senhaAtual && styles.inputError]}
                    placeholder="Digite sua senha atual"
                    value={senhaAtual}
                    onChangeText={setSenhaAtual}
                />
                <Text style={styles.label}>Nova Senha</Text>
                <TextInput
                    style={[styles.input, error && !novaSenha && styles.inputError]}
                    placeholder="Digite sua nova senha"
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <TextInput
                    style={[styles.input, error && !confirmarSenha && styles.inputError]}
                    placeholder="Confirme sua nova senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                />
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                    style={[styles.input, error && !confirmarSenha && styles.inputError]}
                    placeholder="Digite a senha novamente"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={onAlterarSenhaPress}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : ( 
                        <Text style={styles.buttonText}>Alterar Senha</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  innerContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  label: { fontSize: 16, marginBottom: 5, color: "#666" },
  input: {
    backgroundColor: "#FFF",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  inputError: { borderColor: "#FF3B30" },
  errorText: { color: "#FF3B30", textAlign: "center", marginBottom: 10 },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 20, textAlign: "center", color: "#007AFF", fontSize: 14 },
});
