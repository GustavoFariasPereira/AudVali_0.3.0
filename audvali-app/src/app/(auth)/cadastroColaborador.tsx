import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCadastrarColaborador } from "@/modules/colaboradores/colaborador.hook";

export default function CadastroColaboradorScreen(){
    const router = useRouter();
    const {handleCadastrarColaborador, loading, error, success} = useCadastrarColaborador();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const onCadastrarPress = async () => {
        await handleCadastrarColaborador(nome, email, senha, confirmarSenha);
    };
    if (success){
       Alert.alert(
        "Código enviado", 
        "Verifique sua caixa de e-mail.", 
        [
            { 
            text: "Avançar", 
            onPress: () => router.replace({
                pathname: "/confirmarEmail",
                params: { email }
            })
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
                <Text style={styles.logo}>Cadastrar Conta</Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={[styles.input, error && !nome && styles.inputError]}
                    placeholder="Digite seu nome"
                    value={nome}
                    onChangeText={setNome}
                />
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={[styles.input, error && !email && styles.inputError]}
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={[styles.input, error && !senha && styles.inputError]}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChangeText={setSenha}
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
                    onPress={onCadastrarPress}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : ( 
                        <Text style={styles.buttonText}>Cadastrar</Text>
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
